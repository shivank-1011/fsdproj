import { useEffect } from "react";
import { useAdminStore } from "../../context/adminStore";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Users, Store, IndianRupee, ShoppingBag, Loader2 } from "lucide-react";
import { LoadingState, ErrorState } from "../../components/UIState";
import "./Admin.css";

export default function AdminDashboard() {
    const { dashboardStats, fetchDashboardStats, isLoading, error } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (isLoading && !dashboardStats) {
        return <LoadingState message="Loading dashboard statistics..." fullHeight />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => fetchDashboardStats()} fullHeight />;
    }

    if (!dashboardStats) return null;

    const statCards = [
        { label: "Total Users", value: dashboardStats.totalUsers, icon: Users, colorClass: "blue" },
        { label: "Total Sellers", value: dashboardStats.totalSellers, icon: Store, colorClass: "purple" },
        { label: "Total Sales", value: `₹${Number(dashboardStats.totalSales).toFixed(2)}`, icon: IndianRupee, colorClass: "green" },
        { label: "Total Orders", value: dashboardStats.totalOrders, icon: ShoppingBag, colorClass: "orange" },
    ];

    const chartData = dashboardStats.topProducts?.map((item) => ({
        name: item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
        sold: item.totalSold,
    })) || [];

    return (
        <div>
            <h1 className="admin-page-title">Dashboard Overview</h1>

            <div className="admin-stats-grid">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="admin-stat-card glass">
                        <div className={`admin-stat-icon-wrapper ${stat.colorClass}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="admin-stat-label">{stat.label}</p>
                            <p className="admin-stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-chart-container glass">
                <h2 className="admin-chart-title">Top Selling Products</h2>
                {chartData.length > 0 ? (
                    <div style={{ height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
                                    angle={-90}
                                    textAnchor="end"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-family-base)' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(235, 94, 40, 0.05)' }}
                                    contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-surface)', backdropFilter: 'blur(10px)', color: 'var(--color-text)', fontFamily: 'var(--font-family-base)', boxShadow: 'var(--shadow-lg)' }}
                                />
                                <Bar
                                    dataKey="sold"
                                    fill="var(--color-primary)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                        No sales data available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
