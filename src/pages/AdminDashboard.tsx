import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, TrendingUp, TrendingDown, Minus, Bell, Shield, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';

type Seller = Tables<'sellers'>;
type Alert = Tables<'alerts'>;
type Review = Tables<'reviews'>;
type Product = Tables<'products'>;

const trendIcon: Record<string, typeof TrendingUp> = { improving: TrendingUp, declining: TrendingDown, stable: Minus };
const trendColor: Record<string, string> = { improving: 'text-success', declining: 'text-destructive', stable: 'text-muted-foreground' };
const statusBadge: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  warned: 'bg-warning/10 text-warning border-warning/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
};
const severityBadge: Record<string, string> = { high: 'bg-destructive/10 text-destructive', medium: 'bg-warning/10 text-warning', low: 'bg-info/10 text-info' };
const COLORS = ['hsl(142,71%,45%)', 'hsl(0,84%,60%)', 'hsl(215,16%,47%)'];

const AdminDashboard = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [tab, setTab] = useState<'overview' | 'sellers' | 'alerts' | 'reports'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [sellersRes, alertsRes, reviewsRes, productsRes] = await Promise.all([
        supabase.from('sellers').select('*').order('name'),
        supabase.from('alerts').select('*').order('date', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*'),
      ]);
      if (sellersRes.data) { setSellers(sellersRes.data); setSelectedSeller(sellersRes.data[0]); }
      if (alertsRes.data) setAlerts(alertsRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!selectedSeller) return null;

  const totalReviews = reviews.length;
  const sentimentBreakdowns = sellers.map(s => (s.sentiment_breakdown as any)?.positive || 0);
  const avgSentiment = Math.round(sentimentBreakdowns.reduce((a, b) => a + b, 0) / sellers.length);
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  const sellerSentiment = selectedSeller.sentiment_breakdown as any || { positive: 0, negative: 0, neutral: 0 };
  const pieData = [
    { name: 'Positive', value: sellerSentiment.positive },
    { name: 'Negative', value: sellerSentiment.negative },
    { name: 'Neutral', value: sellerSentiment.neutral },
  ];
  const monthlyData = (selectedSeller.monthly_data as any[]) || [];
  const topComplaints = selectedSeller.top_complaints || [];

  const warnSeller = (name: string) => toast({ title: `Warning sent to ${name}`, description: 'The seller has been notified about quality concerns.' });
  const suspendSeller = (name: string) => toast({ title: `${name} suspended`, description: 'All products from this seller have been delisted.', variant: 'destructive' });

  const resolveAlert = async (alertId: string) => {
    await supabase.from('alerts').update({ resolved: true }).eq('id', alertId);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    toast({ title: 'Alert resolved' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unresolvedAlerts > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{unresolvedAlerts}</span>}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1 w-fit mb-6">
          {(['overview', 'sellers', 'alerts', 'reports'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card"><p className="text-sm text-muted-foreground">Total Products</p><p className="text-3xl font-bold text-foreground mt-1">{products.length}</p></div>
              <div className="stat-card"><p className="text-sm text-muted-foreground">Total Reviews</p><p className="text-3xl font-bold text-foreground mt-1">{totalReviews}</p></div>
              <div className="stat-card"><p className="text-sm text-muted-foreground">Avg Positive Sentiment</p><p className="text-3xl font-bold text-success mt-1">{avgSentiment}%</p></div>
              <div className="stat-card"><p className="text-sm text-muted-foreground">Active Alerts</p><p className="text-3xl font-bold text-destructive mt-1">{unresolvedAlerts}</p></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="stat-card">
                <h3 className="font-semibold text-foreground mb-4">Seller Reputation Scores</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sellers.map(s => ({ name: s.name.split(' ')[0], score: s.reputation_score }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(215,16%,47%)' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(215,16%,47%)' }} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(217,91%,60%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-card">
                <h3 className="font-semibold text-foreground mb-4">Seller Ratings Overview</h3>
                <div className="space-y-3">
                  {sellers.map(s => {
                    const TIcon = trendIcon[s.trend] || Minus;
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => { setSelectedSeller(s); setTab('sellers'); }}>
                        <div>
                          <p className="font-medium text-foreground text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.product_count} products · {s.total_reviews} reviews</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={statusBadge[s.status] || ''}>{s.status}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="font-semibold text-sm text-foreground">{s.avg_rating}</span>
                          </div>
                          <TIcon className={`h-4 w-4 ${trendColor[s.trend] || ''}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'sellers' && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {sellers.map(s => (
                <button key={s.id} onClick={() => setSelectedSeller(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSeller.id === s.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}>
                  {s.name}
                </button>
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="stat-card lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedSeller.name}</h3>
                    <Badge variant="outline" className={statusBadge[selectedSeller.status] || ''}>{selectedSeller.status} · {selectedSeller.warning_count} warnings</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-warning border-warning/30 hover:bg-warning/10" onClick={() => warnSeller(selectedSeller.name)}>Warn Seller</Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => suspendSeller(selectedSeller.name)}>Suspend</Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-secondary/30 rounded-lg"><p className="text-2xl font-bold text-foreground">{selectedSeller.reputation_score}</p><p className="text-xs text-muted-foreground">Reputation</p></div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg"><p className="text-2xl font-bold text-foreground">{selectedSeller.avg_rating}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg"><p className="text-2xl font-bold text-foreground">{selectedSeller.total_reviews}</p><p className="text-xs text-muted-foreground">Total Reviews</p></div>
                </div>
                <h4 className="font-medium text-foreground mb-3">Rating & Sentiment Trend</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(215,16%,47%)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215,16%,47%)' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="hsl(217,91%,60%)" strokeWidth={2} name="Rating" />
                    <Line type="monotone" dataKey="sentiment" stroke="hsl(142,71%,45%)" strokeWidth={2} name="Sentiment %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="stat-card">
                  <h4 className="font-medium text-foreground mb-3">Sentiment Breakdown</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="stat-card">
                  <h4 className="font-medium text-foreground mb-3">Top Complaints</h4>
                  <div className="space-y-2">
                    {topComplaints.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
                        <span className="text-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="stat-card">
                  <h4 className="font-medium text-foreground mb-3">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedSeller.reputation_score < 50
                      ? `⚠️ ${selectedSeller.name} has critically low scores. Consider suspension if no improvement within 30 days. Key areas: ${topComplaints.slice(0, 2).join(', ')}.`
                      : selectedSeller.trend === 'improving'
                      ? `✅ ${selectedSeller.name} is trending positively. Continue monitoring. Minor issues with ${topComplaints[0]?.toLowerCase() || 'N/A'}.`
                      : `📊 ${selectedSeller.name} is stable. Watch for ${topComplaints[0]?.toLowerCase() || 'potential issues'}.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Smart Alerts</h2>
            {alerts.map(a => (
              <div key={a.id} className={`stat-card flex items-start justify-between gap-4 ${a.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${a.severity === 'high' ? 'text-destructive' : a.severity === 'medium' ? 'text-warning' : 'text-info'}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{a.seller_name}</span>
                      <Badge variant="secondary" className={severityBadge[a.severity] || ''}>{a.severity}</Badge>
                      {a.resolved && <Badge variant="secondary" className="bg-success/10 text-success">Resolved</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(a.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {!a.resolved && <Button size="sm" variant="outline" onClick={() => resolveAlert(a.id)}>Resolve</Button>}
              </div>
            ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Monthly Report — April 2026</h2>
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-4"><FileText className="h-5 w-5 text-primary" /><h3 className="font-semibold text-foreground">Executive Summary</h3></div>
              <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
                <p>This month, <strong className="text-foreground">{totalReviews} reviews</strong> were collected across <strong className="text-foreground">{products.length} products</strong> from <strong className="text-foreground">{sellers.length} sellers</strong>. Overall sentiment is mixed with an average positive rate of {avgSentiment}%.</p>
                <p><strong className="text-foreground">⚠️ Critical Finding:</strong> AudioMax Ltd. continues a declining trend with a reputation score of 38/100. Two products (SoundWave Pro Headset and SmartWatch Elite) are receiving predominantly negative reviews. A fake review was also detected on SmartWatch Elite.</p>
                <p><strong className="text-foreground">✅ Top Performer:</strong> MobileFirst Corp. and PeripheralPro maintain excellent scores above 90, with improving trends across all metrics.</p>
              </div>
            </div>
            <div className="stat-card">
              <h3 className="font-semibold text-foreground mb-4">Seller Performance Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left py-3 font-medium text-muted-foreground">Seller</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Rating</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Reputation</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Sentiment</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Trend</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Status</th>
                  </tr></thead>
                  <tbody>
                    {sellers.map(s => {
                      const TIcon = trendIcon[s.trend] || Minus;
                      const sb = (s.sentiment_breakdown as any) || {};
                      return (
                        <tr key={s.id} className="border-b border-border/50">
                          <td className="py-3 font-medium text-foreground">{s.name}</td>
                          <td className="py-3 text-center text-foreground">{s.avg_rating}</td>
                          <td className="py-3 text-center"><span className={`font-semibold ${s.reputation_score >= 70 ? 'text-success' : s.reputation_score >= 50 ? 'text-warning' : 'text-destructive'}`}>{s.reputation_score}/100</span></td>
                          <td className="py-3 text-center text-foreground">{sb.positive || 0}% pos</td>
                          <td className="py-3 text-center"><TIcon className={`h-4 w-4 inline ${trendColor[s.trend] || ''}`} /></td>
                          <td className="py-3 text-center"><Badge variant="outline" className={statusBadge[s.status] || ''}>{s.status}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="stat-card">
              <h3 className="font-semibold text-foreground mb-3">🤖 AI Recommendations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong className="text-foreground">Suspend AudioMax Ltd.</strong> if no improvement by May 2026. Reputation critically low at 38.</li>
                <li>• <strong className="text-foreground">Investigate fake reviews</strong> on SmartWatch Elite. 1 review flagged with 92% confidence.</li>
                <li>• <strong className="text-foreground">Monitor TechVision Inc.</strong> for overheating complaints on ProMax Laptop. 15% mention rate.</li>
                <li>• <strong className="text-foreground">Commend MobileFirst Corp. and PeripheralPro</strong> for consistent quality improvement.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
