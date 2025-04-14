import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink as UIBreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbNavLink {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    links?: BreadcrumbNavLink[];
    projectId?: string;
    testRunId?: string;
}

export default function BreadcrumbNav({ links = [] }: BreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {links.map((item, index) => (
                    <React.Fragment key={item.label}>
                        <BreadcrumbItem>
                            {item.href ? (
                                <UIBreadcrumbLink asChild>
                                    <Link href={item.href}>
                                        <span className="flex items-center gap-1">
                                            {item.icon}
                                            {item.label}
                                        </span>
                                    </Link>
                                </UIBreadcrumbLink>
                            ) : (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    {item.icon}
                                    {item.label}
                                </span>
                            )}
                        </BreadcrumbItem>
                        {index < links.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
