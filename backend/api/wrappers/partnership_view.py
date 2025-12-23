from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from ..models import Partnership
from ..serializers import PartnershipSerializer
from utils.cloudinary_utils import delete_cloudinary_image

@api_view(["GET"])
def get_partnerships_data(request):
    partnerships = PartnershipSerializer(Partnership.objects.all(), many=True).data
    return Response({"partnerships": partnerships})


@api_view(["PUT"])
@transaction.atomic
def update_partnerships_data(request):
    payload = request.data or {}
    existing_partnerships = {p.id: p for p in Partnership.objects.all()}

    partnerships_list = payload.get("partnerships", [])

    for p_data in partnerships_list:
        pid = p_data.get("id")
        new_logo = p_data.get("logo")
        
        partnership = existing_partnerships.pop(pid, None) if pid else None

        if partnership:
            # Logo updated?
            if partnership.logo and partnership.logo != new_logo:
                delete_cloudinary_image(partnership.logo)
            
            partnership.name = p_data.get("name", partnership.name)
            partnership.description = p_data.get("description", partnership.description)
            partnership.logo = new_logo or partnership.logo
            partnership.website = p_data.get("website", partnership.website)
            partnership.save()
        else:
            Partnership.objects.create(
                name=p_data.get("name", ""),
                description=p_data.get("description", ""),
                logo=new_logo or "",
                website=p_data.get("website", ""),
            )

    return Response({"message": "✅ Partnerships updated successfully!"})

@api_view(["DELETE"])
def delete_partnership_item(request, id):
    try:
        partnership = Partnership.objects.get(id=id)
        if partnership.logo:
            delete_cloudinary_image(partnership.logo)
        partnership.delete()
        return Response({"message": "✅ Partnership deleted"})
    except Partnership.DoesNotExist:
        return Response({"error": "❌ No partnership with this ID"}, status=404)
