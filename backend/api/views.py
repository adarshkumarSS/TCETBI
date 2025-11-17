from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Notification, IncubationApplication
from .serializers import ContactMessageSerializer, NotificationSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from .serializers import IncubationSerializer
import cloudinary.uploader

@api_view(["POST"])
def submit_contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        msg = serializer.save()

        # 🔔 Create Notification
        Notification.objects.create(
            type="contact",
            title="New Contact Message",
            message=f"{msg.name} submitted a message: {msg.subject}",
            meta={
                "name": msg.name,
                "email": msg.email,
                "phone": msg.phone,
                "subject": msg.subject,
                "message": msg.message,
            }
        )


        return Response({"message": "Message submitted successfully!"}, status=201)

    return Response({"errors": serializer.errors}, status=400)

@api_view(["GET"])
def get_notifications(request):
    notifications = Notification.objects.order_by("-created_at")
    data = NotificationSerializer(notifications, many=True).data
    return Response({"notifications": data})


@api_view(["POST"])
def mark_notification_read(request, id):
    try:
        notif = Notification.objects.get(id=id)
        notif.is_read = True
        notif.save()
        return Response({"message": "Notification marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(["DELETE"])
def delete_notification(request, id):
    try:
        Notification.objects.get(id=id).delete()
        return Response({"message": "Deleted"})
    except Notification.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def submit_incubation(request):
    # Validate PDF size (<2MB)
    resume = request.FILES.get("resume")
    if resume and resume.size > 2 * 1024 * 1024:
        return Response({"error": "Resume must be less than 2MB"}, status=400)

    profile_image = request.FILES.get("profile_image")

    profile_url = None
    resume_url = None

    if profile_image:
        upload = cloudinary.uploader.upload(profile_image)
        profile_url = upload.get("secure_url")

    if resume:
        upload = cloudinary.uploader.upload(resume, resource_type="raw")
        resume_url = upload.get("secure_url")

    data = request.data.copy()
    data["profile_image"] = profile_url
    data["resume_pdf"] = resume_url

    # Save
    serializer = IncubationSerializer(data=data)

    if serializer.is_valid():
        app = serializer.save()

        # Create notification
        Notification.objects.create(
            type="application",
            title="New Incubation Application",
            message=f"{app.fullName} submitted an application for {app.businessName}",
            meta={
                "fullName": app.fullName,
                "businessName": app.businessName,
                "email": app.email,
                "application_id": app.id,
            }
        )

        return Response({"message": "Application submitted", "data": serializer.data}, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_incubation_applications(request):
    applications = IncubationApplication.objects.order_by("-created_at")
    data = IncubationSerializer(applications, many=True).data
    return Response({"applications": data})


@api_view(["POST"])
def update_application_status(request, id):
    try:
        app = IncubationApplication.objects.get(id=id)
        status = request.data.get("status")
        if status in ["pending", "approved", "rejected"]:
            app.status = status
            app.save()
            return Response({"message": f"Application {status}"})
        else:
            return Response({"error": "Invalid status"}, status=400)
    except IncubationApplication.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
