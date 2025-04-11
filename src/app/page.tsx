"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PieChart, Pie, Cell, ResponsiveContainer, Legend} from 'recharts';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Icons} from "@/components/icons";
import {toast} from "@/hooks/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const data = [
  {name: 'Food', value: 400},
  {name: 'Travel', value: 300},
  {name: 'Entertainment', value: 200},
  {name: 'Utilities', value: 100},
  {name: 'Other', value: 50}
];

const RecentTransactions = () => {
  const transactions = [
    {id: 1, date: '2024-07-22', description: 'Grocery Shopping', amount: -50, category: 'Food'},
    {id: 2, date: '2024-07-21', description: 'Train Ticket', amount: -20, category: 'Travel'},
    {id: 3, date: '2024-07-20', description: 'Movie Night', amount: -30, category: 'Entertainment'},
    {id: 4, date: '2024-07-19', description: 'Electricity Bill', amount: -80, category: 'Utilities'},
  ];

  return (
    <Table>
      <TableCaption>Recent transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell className="text-right">{transaction.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const BudgetBreakdownChart = () => {
  const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Breakdown</CardTitle>
        <CardDescription>Distribution of your spending across categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
              ))}
            </Pie>
            <Legend/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const handleBudgetSetup = () => {
    toast({
      title: "Budget Setup Initiated",
      description: "Redirecting to budget setup page...",
      action: (
        <Button variant="link" onClick={() => {
          // replace with navigation
        }}>
          Go to Setup
        </Button>
      ),
    })
  };

  return (
    <div className="h-full flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>Key financial insights at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Spending</CardTitle>
              <CardDescription>This month's total expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remaining Budget</CardTitle>
              <CardDescription>Amount left to spend this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$750</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings</CardTitle>
              <CardDescription>Amount saved this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$250</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <BudgetBreakdownChart/>
        <Card>
          <CardHeader>
            <CardTitle>AI Budgeting Assistant</CardTitle>
            <CardDescription>Get personalized tips to optimize your budget.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Analyzing your spending habits...</p>
            <Button variant="secondary" className="mt-4" onClick={handleBudgetSetup}>Get Budgeting Tips</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <RecentTransactions/>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button variant="ghost" size="icon">
            <Icons.logo className="h-6 w-6"/>
            <span className="sr-only">Collapse sidebar</span>
          </Button>
        </SidebarHeader>
        <SidebarSeparator/>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icons.home className="mr-2 h-4 w-4"/>
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icons.workflow className="mr-2 h-4 w-4"/>
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icons.plusCircle className="mr-2 h-4 w-4"/>
                  <span>Add Transaction</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icons.settings className="mr-2 h-4 w-4"/>
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator/>
          <p className="text-center text-xs text-muted-foreground">
            Built by Firebase Studio
          </p>
        </SidebarFooter>
      </Sidebar>
      <Dashboard/>
    </SidebarProvider>
  );
}
