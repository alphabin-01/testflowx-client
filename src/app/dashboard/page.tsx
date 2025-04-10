import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TestSummaryCards } from "@/components/testlens/test-summary-cards"
import { TestResultsTable } from "@/components/testlens/test-results-table"
import { TestTrendsChart } from "@/components/testlens/test-trends-chart"
import { Button } from "@/components/ui/button"
import { IconAlertTriangle } from "@tabler/icons-react"
import Link from "next/link"

import testData from "../dashboard/test-data.json"

export default function TestLensPage() {
  // Count failed and flaky tests
  const failedTests = testData.filter(test => test.status === "failed" || test.status === "flaky").length

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between px-4 pt-4 lg:px-6">
              <h1 className="text-2xl font-bold">Test Results Dashboard</h1>
              {failedTests > 0 && (
                <Link href="/testlens/failures">
                  <Button variant="destructive" size="sm">
                    <IconAlertTriangle className="size-4 mr-1" />
                    View Failures ({failedTests})
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <TestSummaryCards testData={testData} />
              <div className="px-4 lg:px-6">
                <TestTrendsChart testData={testData} />
              </div>
              <TestResultsTable testData={testData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 