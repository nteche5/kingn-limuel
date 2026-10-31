import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Lock } from 'lucide-react'

export default function AdminPasswordChange() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Admin credentials</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        Admin credentials are managed in your hosting provider&apos;s server-side environment settings. Update
        <code className="mx-1">ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> there, then redeploy.
        They are not displayed or changed in the browser.
      </CardContent>
    </Card>
  )
}
