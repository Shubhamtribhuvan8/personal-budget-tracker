import { SettingsHeader } from "../../../components/settings-header"
import { ProfileSettings } from "../../../components/profile-settings"
import { AppSettings } from "../../../components/app-settings"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full p-6">
      <div className="w-full space-y-6 px-4">
      <SettingsHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileSettings />
        <AppSettings />
      </div>
    </div>
    </div>
  )
}
