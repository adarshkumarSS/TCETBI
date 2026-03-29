from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction

from ..models import Blog
from ..serializers import BlogSerializer
from utils.cloudinary_utils import delete_cloudinary_image

@api_view(["GET"])
def get_blogs_data(request):
    blogs = BlogSerializer(Blog.objects.all().order_by("-id"), many=True).data
    return Response({"blogs": blogs})

@api_view(["PUT"])
@transaction.atomic
def update_blogs_data(request):

    payload = request.data or {}
    existing_blogs = {b.id: b for b in Blog.objects.all()}

    blogs_list = payload.get("blogs", [])

    for blog_data in blogs_list:
        bid = blog_data.get("id")
        new_img = blog_data.get("image")

        blog = existing_blogs.pop(bid, None) if bid else None

        if blog:
            # Cloudinary image updated?
            if blog.image and blog.image != new_img:
                delete_cloudinary_image(blog.image)

            blog.title = blog_data.get("title", blog.title)
            blog.excerpt = blog_data.get("excerpt", blog.excerpt)
            blog.author = blog_data.get("author", blog.author)
            blog.category = blog_data.get("category", blog.category)
            blog.readTime = blog_data.get("readTime", blog.readTime)
            blog.link = blog_data.get("link", blog.link)
            blog.image = new_img or blog.image
            blog.save()

        else:
            Blog.objects.create(
                title=blog_data.get("title", ""),
                excerpt=blog_data.get("excerpt", ""),
                author=blog_data.get("author", ""),
                category=blog_data.get("category", ""),
                readTime=blog_data.get("readTime", 5),
                link=blog_data.get("link", ""),
                image=new_img or "",
            )

    return Response({"message": "[OK] Blogs updated successfully!"})

@api_view(["DELETE"])
def delete_blog_item(request, id):
    try:
        blog = Blog.objects.get(id=id)

        if blog.image:
            delete_cloudinary_image(blog.image)

        blog.delete()
        return Response({"message": "[OK] Blog deleted"})

    except Blog.DoesNotExist:
        return Response({"error": "[ERROR] No blog with this ID"}, status=404)
