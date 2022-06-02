from django.shortcuts import render, redirect

from users.models import Users

# Create your views here.
def login(request):
    return render(request, "users/login.html")


def register(request):
    if request.method == "POST":
        userName = request.POST.get("user_name")
        userPassword = request.POST.get("user_password")
        userEmail = request.POST.get("user_email")
        userGender = request.POST.get("user_gender")
        userPhoneNum = request.POST.get("user_phoneNum")
        userHeight = request.POST.get("user_height")
        userWeight = request.POST.get("user_weight")

        users = Users(
            name=userName,
            password=userPassword,
            email=userEmail,
            gender=userGender,
            phoneNum=userPhoneNum,
            height=userHeight,
            weight=userWeight,
        )
        users.save()
        return redirect("users:login")
    return render(request, "users/register.html")
