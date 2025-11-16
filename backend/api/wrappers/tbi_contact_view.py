from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction

from ..models import TBICEO, TBIContactInfo
from ..serializers import TBICEOSerializer, TBIContactInfoSerializer
from utils.cloudinary_utils import delete_cloudinary_image


@api_view(["GET"])
def get_tbi_contact_data(request):
    """
    Returns CEO info + all contact / quick-contact / map info
    in one payload, similar style to blogs/programs.
    """
    ceo = TBICEO.objects.first()
    contact = TBIContactInfo.objects.first()

    ceo_data = TBICEOSerializer(ceo).data if ceo else None
    contact_data = TBIContactInfoSerializer(contact).data if contact else None

    return Response(
        {
            "ceo": ceo_data,
            "contact": contact_data,
        }
    )


@api_view(["PUT"])
@transaction.atomic
def update_tbi_contact_data(request):
    """
    Upserts (update or create) TBICEO + TBIContactInfo.
    Expect payload:
    {
      "ceo": { ...ceo fields... },
      "contact": { ...contact fields... }
    }
    """
    payload = request.data or {}

    ceo_payload = payload.get("ceo")
    contact_payload = payload.get("contact")

    # ---------- CEO UPDATE / CREATE ----------
    if ceo_payload is not None:
        ceo = TBICEO.objects.first()
        new_img = ceo_payload.get("image")

        if ceo:
            # Image changed? delete old one from Cloudinary
            if ceo.image and new_img and ceo.image != new_img:
                delete_cloudinary_image(ceo.image)

            ceo.name = ceo_payload.get("name", ceo.name)
            ceo.position = ceo_payload.get("position", ceo.position)
            ceo.bio = ceo_payload.get("bio", ceo.bio)
            ceo.experience = ceo_payload.get("experience", ceo.experience)
            ceo.email = ceo_payload.get("email", ceo.email)
            ceo.linkedin = ceo_payload.get("linkedin", ceo.linkedin)
            if new_img:
                ceo.image = new_img
            ceo.save()
        else:
            TBICEO.objects.create(
                name=ceo_payload.get("name", ""),
                position=ceo_payload.get("position", ""),
                bio=ceo_payload.get("bio", ""),
                experience=ceo_payload.get("experience", ""),
                email=ceo_payload.get("email") or None,
                linkedin=ceo_payload.get("linkedin") or None,
                image=ceo_payload.get("image", "") or "",
            )

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
