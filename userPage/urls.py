from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "userPage"

urlpatterns = [
    path("<int:user_id>", views.userPage, name="userPage"),
    path("editUserInfo/<int:user_id>", views.editUserInfo, name="editUserInfo"),
    path("folowers", views.showFollowers, name="followers"),
    path("followings", views.showFollowings, name="followings"),
    path("myFeeds/<int:user_id>", views.showUserFeeds, name="myFeeds"),
    path("followingFeeds", views.showFollowingFeeds, name="followingFeeds"),
]
