from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ContactMessage, Notification
from .serializers import ContactMessageSerializer, NotificationSerializer

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
