
import MyProfileForm from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_components/MyProfileForm"
import { getUserInfo } from "@/services/auth.services"
import { getMyProfile } from "@/services/user.services"
import { redirect } from "next/navigation"

const MyProfilePage = async () => {
  const currentUser = await getUserInfo()

  if (!currentUser) {
    redirect("/login?redirect=/my-profile")
  }

  const profileResponse = await getMyProfile().catch(() => null)

  if (!profileResponse?.success) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load profile data. Please refresh and try again.
      </div>
    )
  }

  return <MyProfileForm profile={profileResponse.data} />
}

export default MyProfilePage