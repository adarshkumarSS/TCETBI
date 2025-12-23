from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction

from ..models import TBICEO, TBIContactInfo
from ..serializers import TBICEOSerializer, TBIContactInfoSerializer
from utils.cloudinary_utils import delete_cloudinary_image


@api_view(["GET"])
def get_tbi_contact_data(request):
    """
    Returns all contact / quick-contact / map info
    in one payload, similar style to blogs/events.
    """
    contact = TBIContactInfo.objects.first()
    contact_data = TBIContactInfoSerializer(contact).data if contact else None

    return Response(
        {
            "contact": contact_data,
        }
    )


@api_view(["PUT"])
@transaction.atomic
def update_tbi_contact_data(request):
    """
    Upserts (update or create) TBIContactInfo.
    Expect payload:
    {
      "contact": { ...contact fields... }
    }
    """
    payload = request.data or {}
    contact_payload = payload.get("contact")

    # ---------- CONTACT UPDATE / CREATE ----------
    if contact_payload is not None:
        contact = TBIContactInfo.objects.first()

        if contact:
            contact.address = contact_payload.get("address", contact.address)
            contact.phone = contact_payload.get("phone", contact.phone)
            contact.email = contact_payload.get("email", contact.email)
            contact.working_hours = contact_payload.get(
                "working_hours", contact.working_hours
            )

            contact.quick_title = contact_payload.get(
                "quick_title", contact.quick_title
            )
            contact.quick_subtitle = contact_payload.get(
                "quick_subtitle", contact.quick_subtitle
            )

            contact.office_address = contact_payload.get(
                "office_address", contact.office_address
            )
            contact.contact_phone = contact_payload.get(
                "contact_phone", contact.contact_phone
            )
            contact.contact_email = contact_payload.get(
                "contact_email", contact.contact_email
            )
            contact.website = contact_payload.get("website", contact.website)

            contact.map_embed_url = contact_payload.get(
                "map_embed_url", contact.map_embed_url
            )

            contact.save()
        else:
            TBIContactInfo.objects.create(
                address=contact_payload.get("address", ""),
                phone=contact_payload.get("phone", ""),
                email=contact_payload.get("email", ""),
                working_hours=contact_payload.get("working_hours", ""),
                quick_title=contact_payload.get("quick_title", "Quick Contact"),
                quick_subtitle=contact_payload.get(
                    "quick_subtitle", "Reach out to us for immediate assistance"
                ),
                office_address=contact_payload.get("office_address", ""),
                contact_phone=contact_payload.get("contact_phone", ""),
                contact_email=contact_payload.get("contact_email", ""),
                website=contact_payload.get("website") or None,
                map_embed_url=contact_payload.get("map_embed_url", ""),
            )

    return Response({"message": "✅ TBI contact updated successfully!"})
