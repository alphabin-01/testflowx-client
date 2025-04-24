"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { IconBell, IconShield, IconUser, IconKey } from "@tabler/icons-react"

export default function Settings() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [browserNotifications, setBrowserNotifications] = useState(false)

    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-3">
                <TabsTrigger value="account" className="flex items-center gap-2">
                    <IconUser className="h-4 w-4" /> Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <IconBell className="h-4 w-4" /> Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                    <IconShield className="h-4 w-4" /> Security
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                    <IconKey className="h-4 w-4" /> API Keys
                </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            Update your personal information and preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="john.doe@example.com" />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Company Information</h3>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <Input id="company" defaultValue="Acme Inc." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Job Role</Label>
                                <Input id="role" defaultValue="Software Engineer" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="notifications">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Configure how you receive notifications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Email Notifications</h3>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive test results and updates via email
                                    </p>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Browser Notifications</h3>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications in your browser
                                    </p>
                                </div>
                                <Switch
                                    id="browser-notifications"
                                    checked={browserNotifications}
                                    onCheckedChange={setBrowserNotifications}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="security">
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>
                            Manage your password and security settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Change Password</h3>
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account by enabling two-factor authentication.
                            </p>
                            <Button variant="outline">Enable Two-Factor Authentication</Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="api">
                <Card>
                    <CardHeader>
                        <CardTitle>API Keys</CardTitle>
                        <CardDescription>
                            Manage your API keys for third-party integrations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Production API Key</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Last used 2 days ago
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">Regenerate</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input defaultValue="sk_prod_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                                <Button variant="ghost" size="sm">Copy</Button>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Development API Key</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Last used 5 hours ago
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">Regenerate</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input defaultValue="sk_dev_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                                <Button variant="ghost" size="sm">Copy</Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Create New API Key</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}