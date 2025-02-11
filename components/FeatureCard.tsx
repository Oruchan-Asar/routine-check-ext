import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export function FeatureCard({
  icon,
  title,
  description,
  onClick,
}: FeatureCardProps) {
  return (
    <Card
      className="hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="text-primary mb-2">{icon}</div>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
