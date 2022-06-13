import json
from django.shortcuts import redirect, render
from .models import User, Comment
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Create your views here.
def comment(request, comment_id):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user.username)
        comment = comment.objects.get(pk=comment_id)

    if request.method == "POST":
        commentContent = request.POST.get("comment_content")

        comment = Comment(
            author=user,
            comment=comment,
            content=commentContent,
        )
        comment.save()
        return redirect("comment:show", comment_id=comment.id)
    return render(request, "comment/comment.html")


@csrf_exempt
def editComment(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    if not request.user.is_authenticated:
        return redirect("user:login")

    data = json.loads(request.body)
    commentId = data.get("commentId", "")
    comment = Comment.objects.get(pk=commentId)
    commentContentTextarea = data.get("commentContentTextarea", "")

    if commentContentTextarea:
        if request.user.pk != comment.author.pk:
            return JsonResponse({"error": "You can't edit other's comment"})

        comment.content = commentContentTextarea
        comment.save()

    return JsonResponse(
        {"message": "Comment has been edited successfully!"},
        status=201,
    )


@csrf_exempt
def deleteComment(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request required."}, status=400)

    if not request.user.is_authenticated:
        return redirect("user:login")

    data = json.loads(request.body)
    commentId = data.get("commentId", "")
    comment = Comment.objects.get(pk=commentId)
    deleteStatus = data.get("deleteStatus", "")

    if deleteStatus:
        if request.user.pk != comment.author.pk:
            return JsonResponse({"error": "You can't delete other's comment"})

        comment.delete()

    return JsonResponse(
        {"message": "Comment has been deleted successfully!"},
        status=201,
    )


@csrf_exempt
def commentLike(request):
    if request.method == "POST":
        commentId = request.POST.get("commentId")
        commentIsLiked = request.POST.get("commentIsLiked")

        try:
            comment = Comment.objects.get(pk=commentId)
            if commentIsLiked == "no":
                comment.like.add(request.user)
                commentIsLiked = "yes"
            else:
                comment.like.remove(request.user)
                commentIsLiked = "no"

            comment.save()

            return JsonResponse(
                {
                    "commentLikeCnt": comment.like.count(),
                    "commentIsLiked": commentIsLiked,
                    "status": 201,
                },
                status=201,
            )
        except:
            return JsonResponse(
                {
                    "error": "comment not found",
                    "status": 404,
                },
                status=404,
            )

    return JsonResponse({}, status=400)
