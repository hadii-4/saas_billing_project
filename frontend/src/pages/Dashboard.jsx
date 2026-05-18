
// import { useEffect, useState, useMemo } from 'react';
// import API from '../services/api';
// import {
//     useReactTable,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     flexRender,
// } from '@tanstack/react-table';

// const Dashboard = () => {
//     // --- All States (Moved inside to fix the React Hook Error) ---
//     const [plans, setPlans] = useState([]);
//     const [invoices, setInvoices] = useState([]);
//     const [allUserInvoices, setAllUserInvoices] = useState([]); 
//     const [ownerActivePlan, setOwnerActivePlan] = useState(null); 
//     const [loading, setLoading] = useState(false);
    
//     // Payment States
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const [paymentData, setPaymentData] = useState({
//         cardName: '',
//         cardNumber: '',
//         expiry: '',
//         cvv: '',
//         mobileNumber: '',
//         method: 'Credit Card'
//     });

//     // Auth Data
//     const [role] = useState(localStorage.getItem('role')); 
//     const [userName] = useState(localStorage.getItem('userName')); 
//     const [ownerName] = useState(localStorage.getItem('ownerName')); 

//     // Form States
//     const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: 'monthly', features: '' });
//     const [editingPlan, setEditingPlan] = useState(null); 
//     const [team, setTeam] = useState([]);
//     const [newMember, setNewMember] = useState({ fullName: '', email: '', password: '' });
//     const [editingMember, setEditingMember] = useState(null); 

//     // Table States
//     const [filtering, setFiltering] = useState('');
//     const [sorting, setSorting] = useState([]);

//     // --- Helper Functions ---
//     const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : "N/A";
//     const handleLogout = () => { localStorage.clear(); window.location.href = '/'; };

//     // --- NEW: Print Slip Function ---
//     const handlePrintSlip = (invoice) => {
//         const printContent = `
//             <html>
//                 <head>
//                     <title>Invoice - ${invoice.planName}</title>
//                     <style>
//                         body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
//                         .box { border: 1px solid #eee; padding: 30px; max-width: 500px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
//                         .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
//                         .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #fafafa; }
//                         .label { font-weight: bold; color: #555; }
//                         .status { color: green; font-weight: bold; }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="box">
//                         <div class="header"><h2>Payment Receipt</h2><p>SaaS Platform Official</p></div>
//                         <div class="row"><span class="label">Invoice To:</span><span>${invoice.userEmail || userName}</span></div>
//                         <div class="row"><span class="label">Plan:</span><span>${invoice.planName}</span></div>
//                         <div class="row"><span class="label">Amount:</span><span>$${invoice.amount || 'Paid'}</span></div>
//                         <div class="row"><span class="label">Date:</span><span>${formatDate(invoice.startDate || invoice.createdAt)}</span></div>
//                         <div class="row"><span class="label">Payment Method:</span><span>${invoice.paymentMethod || 'Online'}</span></div>
//                         <div class="row"><span class="label">Status:</span><span class="status">SUCCESSFUL</span></div>
//                         <p style="text-align:center; font-size:12px; color:#888; margin-top:30px;">Thank you for your business!</p>
//                     </div>
//                 </body>
//             </html>
//         `;
//         const win = window.open('', '', 'width=900,height=700');
//         win.document.write(printContent);
//         win.document.close();
//         win.print();
//     };
//     // --- TanStack Table Columns ---
//     const columns = useMemo(() => [
//         { header: 'Plan Name', accessorKey: 'planName' },
//         {
//             header: 'Status',
//             accessorKey: 'status',
//             cell: ({ row }) => {
//                 const status = row.original.subStatus || row.original.status || 'N/A';
//                 const isActive = status === 'active';
//                 return (
//                     <span style={{ color: isActive ? '#28a745' : '#6c757d', fontWeight: 'bold' }}>
//                         {status.toUpperCase()}
//                     </span>
//                 );
//             }
//         },
//         { header: 'Start Date', accessorKey: 'startDate', cell: ({ getValue }) => formatDate(getValue()) },
//         { header: 'Expiry Date', accessorKey: 'endDate', cell: ({ getValue }) => formatDate(getValue()) }
//     ], []);

//     const adminInvoiceColumns = useMemo(() => [
//         { header: 'User Email', accessorKey: 'userEmail' },
//         { header: 'Plan', accessorKey: 'planName' },
//         { 
//             header: 'Status', 
//             accessorKey: 'status',
//             cell: ({ row }) => (
//                 <span style={{ color: row.original.status === 'active' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
//                     {(row.original.status || 'N/A').toUpperCase()}
//                 </span>
//             )
//         },
//         { header: 'Start Date', accessorKey: 'startDate', cell: ({ getValue }) => formatDate(getValue()) }
//     ], []);

//     // Table Instance for Owner/Member
//     const table = useReactTable({
//         data: invoices,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(), 
//         state: { globalFilter: filtering, sorting },
//         onGlobalFilterChange: setFiltering,
//         onSortingChange: setSorting,
//         initialState: { pagination: { pageSize: 5 } },
//     });



//     // Table Instance for Admin
//     const adminTable = useReactTable({
//         data: allUserInvoices,
//         columns: adminInvoiceColumns,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         state: { globalFilter: filtering, sorting },
//         onGlobalFilterChange: setFiltering,
//         onSortingChange: setSorting,
//         initialState: { pagination: { pageSize: 5 } },
//     });

//     const fetchData = async () => {
//         try {
//             const plansRes = await API.get('/plans');
//             setPlans(plansRes.data || []);
//             const invoiceRes = await API.get('/subscriptions/my-invoices'); 
//             setInvoices(invoiceRes.data || []); 

//             if (role === 'Admin') {
//                 const allInvRes = await API.get('/users/admin/all-invoices');
//                 setAllUserInvoices(allInvRes.data || []);
//             }
//             if (role === 'Team Member') {
//                 try {
//                     const res = await API.get('/subscriptions/owner-plan');
//                     setOwnerActivePlan(res.data?.activePlanName || null);
//                 } catch (err) { setOwnerActivePlan(null); }
//             }
//             if (role === 'Account Owner') {
//                 const teamRes = await API.get('/users/my-team');
//                 setTeam(teamRes.data || []);
//             }
//         } catch (err) { console.error("Error fetching dashboard data", err); }
//     };

//     useEffect(() => { fetchData(); }, [role]);

//     // --- Handlers ---
//     const handleAddPlan = async (e) => {
//         e.preventDefault();
//         let featuresArray = Array.isArray(newPlan.features) ? newPlan.features : newPlan.features.split(',').map(f => f.trim()).filter(f => f !== '');
//         const planData = { ...newPlan, price: Number(newPlan.price), features: featuresArray };
//         try {
//             if (editingPlan) { await API.put(`/plans/${editingPlan.id}`, planData); alert("Plan Updated!"); }
//             else { await API.post('/plans', planData); alert("Plan Created!"); }
//             setEditingPlan(null);
//             setNewPlan({ name: '', price: '', duration: 'monthly', features: '' });
//             await fetchData(); 
//         } catch (err) { alert("Error: " + (err.response?.data?.message || err.message)); }
//     };

//     const handleEditClick = (plan) => {
//         setEditingPlan(plan);
//         setNewPlan({ name: plan.name, price: plan.price, duration: plan.duration, features: plan.features ? plan.features.join(', ') : '' });
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handleCancelEdit = () => {
//         setEditingPlan(null);
//         setNewPlan({ name: '', price: '', duration: 'monthly', features: '' });
//     };

//     const handleDeletePlan = async (planId) => {
//         if (!window.confirm("Delete this plan?")) return;
//         try { await API.delete(`/plans/${planId}`); await fetchData(); } 
//         catch (err) { alert(err.message); }
//     };

//     // Modified handleSubscribe to show modal first
//     const handleSubscribeClick = (plan) => {
//         setSelectedPlan(plan);
//         setShowPaymentModal(true);
//     };

//     const handleProcessPayment = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const hasActive = invoices.some(inv => inv.subStatus === 'active' || inv.status === 'active');
//             const payload = {
//                 planId: selectedPlan.id,
//                 paymentMethod: paymentData.method,
//                 paymentDetails: { ...paymentData }
//             };

//             if (hasActive) { await API.put('/subscriptions/upgrade', payload); alert("Plan Switched!"); }
//             else { await API.post('/subscriptions/buy', payload); alert("Subscribed!"); }

//             setShowPaymentModal(false);
//             setPaymentData({ cardName: '', cardNumber: '', expiry: '', cvv: '', method: 'Credit Card' });
//             await fetchData();
//         } catch (err) { alert("Failed: " + (err.response?.data?.message || err.message)); }
//         finally { setLoading(false); }
//     };

//     const handleCancelSubscription = async () => {
//         if (!window.confirm("Cancel active plan?")) return;
//         try { await API.put('/subscriptions/cancel'); await fetchData(); } 
//         catch (err) { alert(err.message); }
//     };

//     const handleClearHistory = async () => {
//         if (!window.confirm("Clear history?")) return;
//         try { await API.delete('/subscriptions/clear-history'); await fetchData(); } 
//         catch (err) { alert(err.message); }
//     };

//     const handleClearAllInvoices = async () => {
//         if (!window.confirm("Clear all invoice history?")) return;
//         try { await API.delete('/users/admin/clear-invoices'); await fetchData(); } 
//         catch (err) { alert(err.message); }
//     };

//     const handleAddMember = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingMember) {
//                 await API.put(`/users/member/${editingMember.id}`, newMember);
//                 alert("Member Updated!");
//                 setEditingMember(null);
//             } else {
//                 await API.post('/users/add-member', newMember);
//                 alert("Member Added!");
//             }
//             setNewMember({ fullName: '', email: '', password: '' });
//             await fetchData();
//         } catch (err) { alert("Error: " + err.message); }
//     };

//     const handleInviteMember = async (e) => {
//         e.preventDefault();
//         try {
//             await API.post('/users/invite-member', { email: inviteEmail });
//             alert("Invitation sent!");
//             setInviteEmail('');
//         } catch (err) { alert("Error: " + err.message); }
//     };

//     const handleEditMemberClick = (member) => {
//         setEditingMember(member);
//         setNewMember({ fullName: member.fullName, email: member.email, password: '' });
//         window.scrollTo({ top: 500, behavior: 'smooth' }); 
//     };

//     const handleDeleteMember = async (memberId) => {
//         if (!window.confirm("Are you sure?")) return;
//         try { await API.delete(`/users/member/${memberId}`); await fetchData(); } 
//         catch (err) { alert("Error: " + err.message); }
//     };

//     const activeTable = role === 'Admin' ? adminTable : table;

//     return (
//         <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
//            {/* Payment Modal (Overlay) */}
// {showPaymentModal && (
//     <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//         <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '420px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
//             <h3 style={{ marginTop: 0, textAlign: 'center', color: '#333' }}>Pay for {selectedPlan?.name}</h3>
            
//             {/* Payment Method Tabs */}
//             <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
//                 {['Credit Card', 'JazzCash', 'Easypaisa'].map(m => (
//                     <button 
//                         key={m}
//                         type="button"
//                         onClick={() => setPaymentData({...paymentData, method: m})}
//                         style={{
//                             flex: 1, padding: '12px 5px', borderRadius: '8px', 
//                             border: paymentData.method === m ? '2px solid #007bff' : '1px solid #ddd',
//                             backgroundColor: paymentData.method === m ? '#e7f1ff' : 'white', 
//                             cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', transition: '0.3s'
//                         }}
//                     >
//                         {m === 'JazzCash' && '🟠 '}
//                         {m === 'Easypaisa' && '🟢 '}
//                         {m === 'Credit Card' && '💳 '}
//                         {m}
//                     </button>
//                 ))}
//             </div>

//             <form onSubmit={handleProcessPayment}>
//                 {/* --- Credit Card Fields --- */}
//                 {paymentData.method === 'Credit Card' && (
//                     <>
//                         <input type="text" placeholder="Card Holder Name" required style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} value={paymentData.cardName} onChange={e => setPaymentData({...paymentData, cardName: e.target.value})} />
//                         <input type="text" placeholder="Card Number" required style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} value={paymentData.cardNumber} onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})} />
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                             <input type="text" placeholder="MM/YY" required style={{ flex: 1, padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} value={paymentData.expiry} onChange={e => setPaymentData({...paymentData, expiry: e.target.value})} />
//                             <input type="text" placeholder="CVV" required style={{ flex: 1, padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} value={paymentData.cvv} onChange={e => setPaymentData({...paymentData, cvv: e.target.value})} />
//                         </div>
//                     </>
//                 )}

//                 {/* --- Mobile Wallet Fields (JazzCash / Easypaisa) --- */}
//                 {(paymentData.method === 'JazzCash' || paymentData.method === 'Easypaisa') && (
//                     <div style={{ marginBottom: '20px' }}>
//                         <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>Enter your {paymentData.method} Mobile Number:</label>
//                         <input 
//                             type="text" 
//                             placeholder="03xx xxxxxxx" 
//                             required 
//                             style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }} 
//                             value={paymentData.mobileNumber} 
//                             onChange={e => setPaymentData({...paymentData, mobileNumber: e.target.value})} 
//                         />
//                         <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
//                             * Approval request will be sent to your mobile phone.
//                         </p>
//                     </div>
//                 )}

//                 <button 
//                     type="submit" 
//                     disabled={loading} 
//                     style={{ 
//                         width: '100%', padding: '14px', 
//                         backgroundColor: paymentData.method === 'JazzCash' ? '#f58220' : (paymentData.method === 'Easypaisa' ? '#39b54a' : '#28a745'), 
//                         color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' 
//                     }}
//                 >
//                     {loading ? 'Verifying...' : `Pay $${selectedPlan?.price} now`}
//                 </button>
                
//                 <button type="button" onClick={() => setShowPaymentModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Cancel</button>
//             </form>
//         </div>
//     </div>
// )}

//             {/* Header Section */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                 <div>
//                     <h1 style={{ margin: 0, color: '#333' }}>{role} Dashboard</h1>
//                     <p style={{ margin: '5px 0 0 0', color: '#555' }}>
//                         Welcome back, <strong style={{color: '#007bff'}}>{userName}</strong>
//                     </p>
//                     {role === 'Team Member' && ownerName && (
//                         <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
//                             Team Owner: <strong>{ownerName}</strong>
//                         </p>
//                     )}
//                 </div>
//                 <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//                     Logout
//                 </button>
//             </div>

//             <hr style={{ margin: '30px 0', opacity: 0.1 }} />

//             {/* Member Alert */}
//             {role === 'Team Member' && !ownerActivePlan && (
//                 <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba', textAlign: 'center', fontWeight: 'bold' }}>
//                     ⚠️ Your Team Owner ({ownerName}) currently has no active subscription. Please contact them to access all features.
//                 </div>
//             )}

//             {/* Usage Statistics for Account Owner */}
//             {role === 'Account Owner' && (
//                 <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
//                     <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Workspace Usage</h4>
//                     <p style={{ margin: 0 }}>Team Members: <strong>{team.length} / 10</strong></p>
//                     <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', marginTop: '10px' }}>
//                         <div style={{ width: `${(team.length / 10) * 100}%`, height: '100%', backgroundColor: '#007bff', borderRadius: '5px' }}></div>
//                     </div>
//                 </div>
//             )}

//             {/* Admin Management Form */}
//             {role === 'Admin' && (
//                 <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: editingPlan ? '5px solid #ffc107' : 'none' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//                         <h3 style={{ margin: 0, color: editingPlan ? '#856404' : '#007bff' }}>
//                             {editingPlan ? `Editing: ${editingPlan.name}` : '+ Create New Subscription Plan'}
//                         </h3>
//                         {editingPlan && (
//                             <button onClick={handleCancelEdit} style={{ padding: '5px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//                                 Cancel Edit
//                             </button>
//                         )}
//                     </div>
//                     <form onSubmit={handleAddPlan} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
//                         <input type="text" placeholder="Plan Name" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '1'}}/>
//                         <input type="number" placeholder="Price ($)" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: e.target.value})} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', width: '120px'}}/>
//                         <select value={newPlan.duration} onChange={e => setNewPlan({...newPlan, duration: e.target.value})} style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white'}}>
//                             <option value="monthly">Monthly</option>
//                             <option value="yearly">Yearly</option>
//                         </select>
//                         <input type="text" placeholder="Features (comma separated)" value={newPlan.features} onChange={e => setNewPlan({...newPlan, features: e.target.value})} style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '2'}}/>
//                         <button type="submit" style={{ padding: '12px 25px', backgroundColor: editingPlan ? '#ffc107' : '#007bff', color: editingPlan ? 'black' : 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//                             {editingPlan ? 'Update Plan' : 'Save Plan'}
//                         </button>
//                     </form>
//                 </div>
//             )}

//             {/* Plans Display Grid */}
//             <h2 style={{ color: '#333' }}>Available SaaS Plans</h2>
//             <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '40px' }}>
//                 {plans.map(plan => {
//                     const isPlanActive = invoices.some(inv => inv.planName === plan.name && (inv.subStatus === 'active' || inv.status === 'active')) || (role === 'Team Member' && ownerActivePlan === plan.name);
//                     const anyActivePlan = invoices.some(inv => inv.subStatus === 'active' || inv.status === 'active');

//                     return (
//                         <div key={plan.id} style={{ 
//                             border: isPlanActive ? '3px solid #28a745' : '1px solid #eee', 
//                             padding: '25px', borderRadius: '15px', width: '260px', 
//                             backgroundColor: 'white', 
//                             boxShadow: isPlanActive ? '0 10px 30px rgba(40, 167, 69, 0.2)' : '0 10px 20px rgba(0,0,0,0.05)', 
//                             textAlign: 'center', position: 'relative'
//                         }}>
//                             {isPlanActive && <span style={{position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#28a745', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'}}>ACTIVE</span>}
//                             <h3 style={{ color: '#007bff' }}>{plan.name}</h3>
//                             <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>${plan.price}</p>
//                             <ul style={{ textAlign: 'left', fontSize: '13px', color: '#666', minHeight: '80px', paddingLeft: '20px' }}>
//                                 {plan.features && plan.features.map((f, i) => <li key={i} style={{marginBottom: '5px'}}>{f}</li>)}
//                             </ul>
//                             {role === 'Account Owner' && (
//                                 <button onClick={() => handleSubscribeClick(plan)} disabled={loading || isPlanActive} style={{ width: '100%', padding: '12px', backgroundColor: isPlanActive ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                                     {isPlanActive ? "Current Plan" : (anyActivePlan ? "Switch Plan" : "Subscribe")}
//                                 </button>
//                             )}
//                             {role === 'Admin' && (
//                                 <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                                     <button onClick={() => handleEditClick(plan)} style={{flex:1, backgroundColor: '#ffc107', border:'none', padding:'8px', borderRadius:'5px', cursor: 'pointer'}}>Edit</button>
//                                     <button onClick={() => handleDeletePlan(plan.id)} style={{flex:1, backgroundColor: '#dc3545', color:'white', border:'none', padding:'8px', borderRadius:'5px', cursor: 'pointer'}}>Delete</button>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Team Management - For Owners */}
//             {role === 'Account Owner' && (
//                 <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
//                     <h2 style={{ color: '#333' }}>Team Management</h2>
//                     <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
//                         <input type="text" placeholder="Full Name" value={newMember.fullName} onChange={e => setNewMember({...newMember, fullName: e.target.value})} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: 1}}/>
//                         <input type="email" placeholder="Email Address" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: 1}}/>
//                         {!editingMember && <input type="password" placeholder="Password" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: 1}}/>}
//                         <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//                             {editingMember ? 'Update Member' : 'Add Member'}
//                         </button>
//                     </form>
//                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                         <thead>
//                             <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
//                                 <th style={{ padding: '15px' }}>Name</th>
//                                 <th style={{ padding: '15px' }}>Email</th>
//                                 <th style={{ padding: '15px' }}>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {team.map(m => (
//                                 <tr key={m.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
//                                     <td style={{ padding: '15px' }}>{m.fullName}</td>
//                                     <td style={{ padding: '15px' }}>{m.email}</td>
//                                     <td style={{ padding: '15px' }}>
//                                         <button onClick={() => handleEditMemberClick(m)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
//                                         <button onClick={() => handleDeleteMember(m.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* Invoices Table */}
//             {(role === 'Account Owner' || role === 'Admin') && (
//                 <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                         <h2 style={{ margin: 0, color: '#333' }}>{role === 'Admin' ? 'All User Invoices' : 'Billing History'}</h2>
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                             {role === 'Account Owner' && (
//                                 <>
//                                     {invoices.length > 0 && <button onClick={handleClearHistory} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Clear History</button>}
//                                     {invoices.some(inv => inv.subStatus === 'active' || inv.status === 'active') && (
//                                         <button onClick={handleCancelSubscription} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel Active Plan</button>
//                                     )}
//                                 </>
//                             )}
//                             {role === 'Admin' && allUserInvoices.length > 0 && (
//                                 <button onClick={handleClearAllInvoices} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Clear All Invoices</button>
//                             )}
//                         </div>
//                     </div>

//                     <input 
//                         type="text" 
//                         value={filtering} 
//                         onChange={e => setFiltering(e.target.value)}
//                         placeholder="Search records..."
//                         style={{ marginBottom: '15px', padding: '12px', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
//                     />
                    
//                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                         <thead>
//                             {activeTable.getHeaderGroups().map(hg => (
//                                 <tr key={hg.id} style={{ backgroundColor: '#f8f9fa' }}>
//                                     {hg.headers.map(header => (
//                                         <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ padding: '15px', textAlign: 'left', cursor: 'pointer', borderBottom: '2px solid #eee' }}>
//                                             {flexRender(header.column.columnDef.header, header.getContext())}
//                                             {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ' ↕️'}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </thead>
//                         <tbody>
//                             {activeTable.getRowModel().rows.map(row => (
//                                 <tr key={row.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
//                                     {row.getVisibleCells().map(cell => (<td key={cell.id} style={{ padding: '15px' }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
//                         <button onClick={() => activeTable.previousPage()} disabled={!activeTable.getCanPreviousPage()} style={{ padding: '8px 15px', cursor: activeTable.getCanPreviousPage() ? 'pointer' : 'not-allowed' }}>Prev</button>
//                         <button onClick={() => activeTable.nextPage()} disabled={!activeTable.getCanNextPage()} style={{ padding: '8px 15px', cursor: activeTable.getCanNextPage() ? 'pointer' : 'not-allowed' }}>Next</button>
//                     </div>
//                 </div>
//             )}
//         </div>



//     );
// };

// export default Dashboard;

















import { useEffect, useState, useMemo } from 'react';
import API from '../services/api';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';

const Dashboard = () => {
    // --- All States ---
    const [plans, setPlans] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [allUserInvoices, setAllUserInvoices] = useState([]); 
    const [ownerActivePlan, setOwnerActivePlan] = useState(null); 
    const [loading, setLoading] = useState(false);
    
    // Payment States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        mobileNumber: '',
        method: 'Credit Card'
    });

    // Auth Data
    const [role] = useState(localStorage.getItem('role')); 
    const [userName] = useState(localStorage.getItem('userName')); 
    const [ownerName] = useState(localStorage.getItem('ownerName')); 

    // Form States
    const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: 'monthly', features: '' });
    const [editingPlan, setEditingPlan] = useState(null); 
    const [team, setTeam] = useState([]);
    const [newMember, setNewMember] = useState({ fullName: '', email: '', password: '' });
    const [editingMember, setEditingMember] = useState(null);
    const [inviteEmail, setInviteEmail] = useState(''); 

    // Table States
    const [filtering, setFiltering] = useState('');
    const [sorting, setSorting] = useState([]);

    // --- Helper Functions ---
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    
    const handleLogout = () => { 
        localStorage.clear(); 
        window.location.href = '/'; 
    };

    // --- Print Slip Function ---
    
const handlePrintSlip = (invoice) => {
        const printContent = `
            <html>
                <head>
                    <title>Invoice - ${invoice.planName}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
                        .box { border: 1px solid #eee; padding: 30px; max-width: 500px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
                        .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #fafafa; }
                        .label { font-weight: bold; color: #555; }
                        .status { color: green; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="box">
                        <div class="header"><h2>Payment Receipt</h2><p>SaaS Platform Official</p></div>
                        <div class="row"><span class="label">Invoice To:</span><span>${invoice.userEmail || userName}</span></div>
                        <div class="row"><span class="label">Plan:</span><span>${invoice.planName}</span></div>
                        <div class="row"><span class="label">Amount:</span><span>$${invoice.amount || 'Paid'}</span></div>
                        <div class="row"><span class="label">Date:</span><span>${formatDate(invoice.startDate || invoice.createdAt)}</span></div>
                        <div class="row"><span class="label">Payment Method:</span><span>${invoice.paymentMethod || 'Online'}</span></div>
                        <div class="row"><span class="label">Status:</span><span class="status">SUCCESSFUL</span></div>
                        <p style="text-align:center; font-size:12px; color:#888; margin-top:30px;">Thank you for your business!</p>
                    </div>
                </body>
            </html>
        `;
        const win = window.open('', '', 'width=900,height=700');
        win.document.write(printContent);
        win.document.close();
        win.print();
    };
    // --- TanStack Table Columns ---
    const columns = useMemo(() => [
        { 
            header: 'Plan Name', 
            accessorKey: 'planName',
            cell: ({ getValue }) => <strong>{getValue()}</strong>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const status = row.original.subStatus || row.original.status || 'N/A';
                const isActive = status === 'active';
                return (
                    <span style={{ 
                        color: isActive ? '#28a745' : '#6c757d', 
                        fontWeight: 'bold',
                        backgroundColor: isActive ? '#d4edda' : '#e9ecef',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontSize: '12px'
                    }}>
                        {status.toUpperCase()}
                    </span>
                );
            }
        },
        { 
            header: 'Start Date', 
            accessorKey: 'startDate', 
            cell: ({ getValue }) => formatDate(getValue()) 
        },
        { 
            header: 'Expiry Date', 
            accessorKey: 'endDate', 
            cell: ({ getValue }) => formatDate(getValue()) 
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: ({ row }) => (
                <button
                    onClick={() => handlePrintSlip(row.original)}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    🖨️ Print Slip
                </button>
            )
        }
    ], [userName]);

    const adminInvoiceColumns = useMemo(() => [
        { header: 'User Email', accessorKey: 'userEmail' },
        { header: 'Plan', accessorKey: 'planName' },
        { 
            header: 'Status', 
            accessorKey: 'status',
            cell: ({ row }) => (
                <span style={{ 
                    color: row.original.status === 'active' ? '#28a745' : '#dc3545', 
                    fontWeight: 'bold',
                    backgroundColor: row.original.status === 'active' ? '#d4edda' : '#f8d7da',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    fontSize: '12px'
                }}>
                    {(row.original.status || 'N/A').toUpperCase()}
                </span>
            )
        },
        { header: 'Start Date', accessorKey: 'startDate', cell: ({ getValue }) => formatDate(getValue()) },
        { header: 'Expiry Date', accessorKey: 'endDate', cell: ({ getValue }) => formatDate(getValue()) },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: ({ row }) => (
                <button
                    onClick={() => handlePrintSlip(row.original)}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    🖨️ Print Slip
                </button>
            )
        }
    ], []);

    // Table Instance for Owner/Member
    const table = useReactTable({
        data: invoices,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(), 
        state: { globalFilter: filtering, sorting },
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
        initialState: { pagination: { pageSize: 5 } },
    });

    // Table Instance for Admin
    const adminTable = useReactTable({
        data: allUserInvoices,
        columns: adminInvoiceColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter: filtering, sorting },
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting,
        initialState: { pagination: { pageSize: 5 } },
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const plansRes = await API.get('/plans');
            setPlans(plansRes.data || []);
            
            const invoiceRes = await API.get('/subscriptions/my-invoices'); 
            setInvoices(invoiceRes.data || []); 

            if (role === 'Admin') {
                const allInvRes = await API.get('/users/admin/all-invoices');
                setAllUserInvoices(allInvRes.data || []);
            }
            
            if (role === 'Team Member') {
                try {
                    const res = await API.get('/subscriptions/owner-plan');
                    setOwnerActivePlan(res.data?.activePlanName || null);
                } catch (err) { 
                    setOwnerActivePlan(null); 
                }
            }
            
            if (role === 'Account Owner') {
                const teamRes = await API.get('/users/my-team');
                setTeam(teamRes.data || []);
            }
        } catch (err) { 
            console.error("Error fetching dashboard data", err); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, [role]);

    // --- Handlers ---
    const handleAddPlan = async (e) => {
        e.preventDefault();
        let featuresArray = Array.isArray(newPlan.features) ? newPlan.features : newPlan.features.split(',').map(f => f.trim()).filter(f => f !== '');
        const planData = { ...newPlan, price: Number(newPlan.price), features: featuresArray };
        try {
            if (editingPlan) { 
                await API.put(`/plans/${editingPlan.id}`, planData); 
                alert("Plan Updated!"); 
            } else { 
                await API.post('/plans', planData); 
                alert("Plan Created!"); 
            }
            setEditingPlan(null);
            setNewPlan({ name: '', price: '', duration: 'monthly', features: '' });
            await fetchData(); 
        } catch (err) { 
            alert("Error: " + (err.response?.data?.message || err.message)); 
        }
    };

    const handleEditClick = (plan) => {
        setEditingPlan(plan);
        setNewPlan({ 
            name: plan.name, 
            price: plan.price, 
            duration: plan.duration, 
            features: plan.features ? plan.features.join(', ') : '' 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingPlan(null);
        setNewPlan({ name: '', price: '', duration: 'monthly', features: '' });
    };

    const handleDeletePlan = async (planId) => {
        if (!window.confirm("Delete this plan?")) return;
        try { 
            await API.delete(`/plans/${planId}`); 
            await fetchData(); 
        } catch (err) { 
            alert(err.message); 
        }
    };

    const handleSubscribeClick = (plan) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const hasActive = invoices.some(inv => inv.subStatus === 'active' || inv.status === 'active');
            const payload = {
                planId: selectedPlan.id,
                paymentMethod: paymentData.method,
                paymentDetails: { ...paymentData }
            };

            if (hasActive) { 
                await API.put('/subscriptions/upgrade', payload); 
                alert("Plan Switched!"); 
            } else { 
                await API.post('/subscriptions/buy', payload); 
                alert("Subscribed!"); 
            }

            setShowPaymentModal(false);
            setPaymentData({ 
                cardName: '', 
                cardNumber: '', 
                expiry: '', 
                cvv: '', 
                mobileNumber: '',
                method: 'Credit Card' 
            });
            await fetchData();
        } catch (err) { 
            alert("Failed: " + (err.response?.data?.message || err.message)); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm("Cancel active plan?")) return;
        try { 
            await API.put('/subscriptions/cancel'); 
            await fetchData(); 
        } catch (err) { 
            alert(err.message); 
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm("Clear history?")) return;
        try { 
            await API.delete('/subscriptions/clear-history'); 
            await fetchData(); 
        } catch (err) { 
            alert(err.message); 
        }
    };

    const handleClearAllInvoices = async () => {
        if (!window.confirm("Clear all invoice history?")) return;
        try { 
            await API.delete('/users/admin/clear-invoices'); 
            await fetchData(); 
        } catch (err) { 
            alert(err.message); 
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await API.put(`/users/member/${editingMember.id}`, newMember);
                alert("Member Updated!");
                setEditingMember(null);
            } else {
                await API.post('/users/add-member', newMember);
                alert("Member Added!");
            }
            setNewMember({ fullName: '', email: '', password: '' });
            await fetchData();
        } catch (err) { 
            alert("Error: " + err.message); 
        }
    };

    const handleInviteMember = async (e) => {
        e.preventDefault();
        try {
            await API.post('/users/invite-member', { email: inviteEmail });
            alert("Invitation sent!");
            setInviteEmail('');
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            const detail = err.response?.data?.error ? ` (${err.response.data.error})` : "";
            console.error('Invite error:', err.response?.data || err);
            alert("Error: " + message + detail);
        }
    };

    const handleEditMemberClick = (member) => {
        setEditingMember(member);
        setNewMember({ fullName: member.fullName, email: member.email, password: '' });
        window.scrollTo({ top: 500, behavior: 'smooth' }); 
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm("Are you sure?")) return;
        try { 
            await API.delete(`/users/member/${memberId}`); 
            await fetchData(); 
        } catch (err) { 
            alert("Error: " + err.message); 
        }
    };

    const activeTable = role === 'Admin' ? adminTable : table;

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
            {/* Payment Modal (Overlay) */}
            {showPaymentModal && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'rgba(0,0,0,0.6)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    zIndex: 1000 
                }}>
                    <div style={{ 
                        background: 'white', 
                        padding: '30px', 
                        borderRadius: '15px', 
                        width: '420px', 
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <style>
                            {`
                                @keyframes slideIn {
                                    from {
                                        transform: translateY(-50px);
                                        opacity: 0;
                                    }
                                    to {
                                        transform: translateY(0);
                                        opacity: 1;
                                    }
                                }
                            `}
                        </style>
                        <h3 style={{ marginTop: 0, textAlign: 'center', color: '#333' }}>
                            Pay for {selectedPlan?.name}
                        </h3>
                        
                        {/* Payment Method Tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            {['Credit Card', 'JazzCash', 'Easypaisa'].map(m => (
                                <button 
                                    key={m}
                                    type="button"
                                    onClick={() => setPaymentData({...paymentData, method: m})}
                                    style={{
                                        flex: 1, 
                                        padding: '12px 5px', 
                                        borderRadius: '8px', 
                                        border: paymentData.method === m ? '2px solid #007bff' : '1px solid #ddd',
                                        backgroundColor: paymentData.method === m ? '#e7f1ff' : 'white', 
                                        cursor: 'pointer', 
                                        fontWeight: 'bold', 
                                        fontSize: '11px', 
                                        transition: '0.3s'
                                    }}
                                >
                                    {m === 'JazzCash' && '🟠 '}
                                    {m === 'Easypaisa' && '🟢 '}
                                    {m === 'Credit Card' && '💳 '}
                                    {m}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleProcessPayment}>
                            {/* Credit Card Fields */}
                            {paymentData.method === 'Credit Card' && (
                                <>
                                    <input 
                                        type="text" 
                                        placeholder="Card Holder Name" 
                                        required 
                                        style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} 
                                        value={paymentData.cardName} 
                                        onChange={e => setPaymentData({...paymentData, cardName: e.target.value})} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Card Number" 
                                        required 
                                        style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} 
                                        value={paymentData.cardNumber} 
                                        onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})} 
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY" 
                                            required 
                                            style={{ flex: 1, padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                                            value={paymentData.expiry} 
                                            onChange={e => setPaymentData({...paymentData, expiry: e.target.value})} 
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="CVV" 
                                            required 
                                            style={{ flex: 1, padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                                            value={paymentData.cvv} 
                                            onChange={e => setPaymentData({...paymentData, cvv: e.target.value})} 
                                        />
                                    </div>
                                </>
                            )}

                            {/* Mobile Wallet Fields */}
                            {(paymentData.method === 'JazzCash' || paymentData.method === 'Easypaisa') && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
                                        Enter your {paymentData.method} Mobile Number:
                                    </label>
                                    <input 
                                        type="tel" 
                                        placeholder="03xx xxxxxxx" 
                                        required 
                                        pattern="[0-9]{11}"
                                        style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #ddd', fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }} 
                                        value={paymentData.mobileNumber} 
                                        onChange={e => setPaymentData({...paymentData, mobileNumber: e.target.value})} 
                                    />
                                    <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                                        
                                    </p>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading} 
                                style={{ 
                                    width: '100%', 
                                    padding: '14px', 
                                    backgroundColor: paymentData.method === 'JazzCash' ? '#f58220' : (paymentData.method === 'Easypaisa' ? '#39b54a' : '#28a745'), 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: loading ? 'not-allowed' : 'pointer', 
                                    fontWeight: 'bold', 
                                    fontSize: '16px' 
                                }}
                            >
                                {loading ? 'Processing...' : `Pay $${selectedPlan?.price}`}
                            </button>
                            
                            <button 
                                type="button" 
                                onClick={() => setShowPaymentModal(false)} 
                                style={{ 
                                    width: '100%', 
                                    marginTop: '10px', 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    color: '#666',
                                    padding: '10px'
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#333' }}>{role} Dashboard</h1>
                    <p style={{ margin: '10px 0 0 0', color: '#555' }}>
                        Welcome back, <strong style={{color: '#007bff'}}>{userName}</strong>
                    </p>
                    {role === 'Team Member' && ownerName && (
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                            Team Owner: <strong>{ownerName}</strong>
                        </p>
                    )}
                </div>
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        transition: '0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                    Logout
                </button>
            </div>

            <hr style={{ margin: '30px 0', opacity: 0.1 }} />

            {/* Member Alert */}
            {role === 'Team Member' && !ownerActivePlan && (
                <div style={{ 
                    backgroundColor: '#fff3cd', 
                    color: '#856404', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '20px', 
                    border: '1px solid #ffeeba', 
                    textAlign: 'center', 
                    fontWeight: 'bold' 
                }}>
                    ⚠️ Your Team Owner ({ownerName}) currently has no active subscription. Please contact them to access all features.
                </div>
            )}

            {/* Usage Statistics for Account Owner */}
            {role === 'Account Owner' && (
                <div style={{ 
                    background: 'white', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    marginBottom: '30px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Workspace Usage</h4>
                    <p style={{ margin: 0 }}>Team Members: <strong>{team.length} / 10</strong></p>
                    <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px', marginTop: '10px' }}>
                        <div style={{ 
                            width: `${(team.length / 10) * 100}%`, 
                            height: '100%', 
                            backgroundColor: '#007bff', 
                            borderRadius: '5px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>
            )}

            {/* Admin Management Form */}
            {role === 'Admin' && (
                <div style={{ 
                    background: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    marginBottom: '30px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
                    borderLeft: editingPlan ? '5px solid #ffc107' : 'none' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: editingPlan ? '#856404' : '#007bff' }}>
                            {editingPlan ? `✏️ Editing: ${editingPlan.name}` : '+ Create New Subscription Plan'}
                        </h3>
                        {editingPlan && (
                            <button 
                                onClick={handleCancelEdit} 
                                style={{ 
                                    padding: '5px 15px', 
                                    backgroundColor: '#6c757d', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleAddPlan} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input 
                            type="text" 
                            placeholder="Plan Name" 
                            value={newPlan.name} 
                            onChange={e => setNewPlan({...newPlan, name: e.target.value})} 
                            required 
                            style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '1'}}
                        />
                        <input 
                            type="number" 
                            placeholder="Price ($)" 
                            value={newPlan.price} 
                            onChange={e => setNewPlan({...newPlan, price: e.target.value})} 
                            required 
                            style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', width: '120px'}}
                        />
                        <select 
                            value={newPlan.duration} 
                            onChange={e => setNewPlan({...newPlan, duration: e.target.value})} 
                            style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white'}}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Features (comma separated)" 
                            value={newPlan.features} 
                            onChange={e => setNewPlan({...newPlan, features: e.target.value})} 
                            style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '2'}}
                        />
                        <button 
                            type="submit" 
                            style={{ 
                                padding: '12px 25px', 
                                backgroundColor: editingPlan ? '#ffc107' : '#007bff', 
                                color: editingPlan ? 'black' : 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold' 
                            }}
                        >
                            {editingPlan ? 'Update Plan' : 'Save Plan'}
                        </button>
                    </form>
                </div>
            )}

            {/* Plans Display Grid */}
            <h2 style={{ color: '#333' }}>Available SaaS Plans</h2>
            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginBottom: '40px' }}>
                {plans.map(plan => {
                    const isPlanActive = invoices.some(inv => inv.planName === plan.name && (inv.subStatus === 'active' || inv.status === 'active')) || (role === 'Team Member' && ownerActivePlan === plan.name);
                    const anyActivePlan = invoices.some(inv => inv.subStatus === 'active' || inv.status === 'active');

                    return (
                        <div key={plan.id} style={{ 
                            border: isPlanActive ? '3px solid #28a745' : '1px solid #e0e0e0', 
                            padding: '25px', 
                            borderRadius: '15px', 
                            width: '260px', 
                            backgroundColor: 'white', 
                            boxShadow: isPlanActive ? '0 10px 30px rgba(40, 167, 69, 0.2)' : '0 10px 20px rgba(0,0,0,0.05)', 
                            textAlign: 'center', 
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = isPlanActive ? '0 10px 30px rgba(40, 167, 69, 0.2)' : '0 10px 20px rgba(0,0,0,0.05)';
                        }}>
                            {isPlanActive && (
                                <span style={{
                                    position: 'absolute', 
                                    top: '-15px', 
                                    left: '50%', 
                                    transform: 'translateX(-50%)', 
                                    backgroundColor: '#28a745', 
                                    color: 'white', 
                                    padding: '5px 15px', 
                                    borderRadius: '20px', 
                                    fontSize: '12px', 
                                    fontWeight: 'bold'
                                }}>
                                    ACTIVE
                                </span>
                            )}
                            <h3 style={{ color: '#007bff' }}>{plan.name}</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>${plan.price}</p>
                            <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
                                / {plan.duration}
                            </p>
                            <ul style={{ textAlign: 'left', fontSize: '13px', color: '#666', minHeight: '80px', paddingLeft: '20px' }}>
                                {plan.features && plan.features.map((f, i) => (
                                    <li key={i} style={{marginBottom: '5px'}}>✓ {f}</li>
                                ))}
                            </ul>
                            {role === 'Account Owner' && (
                                <button 
                                    onClick={() => handleSubscribeClick(plan)} 
                                    disabled={loading || isPlanActive} 
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        backgroundColor: isPlanActive ? '#28a745' : '#007bff', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        cursor: isPlanActive ? 'default' : 'pointer', 
                                        fontWeight: 'bold',
                                        opacity: isPlanActive ? 0.8 : 1
                                    }}
                                >
                                    {isPlanActive ? "Current Plan" : (anyActivePlan ? "Switch Plan" : "Subscribe")}
                                </button>
                            )}
                            {role === 'Admin' && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button 
                                        onClick={() => handleEditClick(plan)} 
                                        style={{
                                            flex:1, 
                                            backgroundColor: '#ffc107', 
                                            border:'none', 
                                            padding:'8px', 
                                            borderRadius:'5px', 
                                            cursor: 'pointer',
                                            transition: '0.3s'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeletePlan(plan.id)} 
                                        style={{
                                            flex:1, 
                                            backgroundColor: '#dc3545', 
                                            color:'white', 
                                            border:'none', 
                                            padding:'8px', 
                                            borderRadius:'5px', 
                                            cursor: 'pointer',
                                            transition: '0.3s'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Team Management - For Owners */}
            {role === 'Account Owner' && (
                <div style={{ 
                    background: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
                    marginBottom: '30px' 
                }}>
                    <h2 style={{ color: '#333' }}>Team Management</h2>
                    
                    {/* Invite Member Form */}
                    <form onSubmit={handleInviteMember} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input type="email" placeholder="Email Address to Invite" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: 1}}/>
                        <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Invite Member
                        </button>
                    </form>
                    
                    <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={newMember.fullName} 
                            onChange={e => setNewMember({...newMember, fullName: e.target.value})} 
                            required 
                            style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '1', minWidth: '150px'}}
                        />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={newMember.email} 
                            onChange={e => setNewMember({...newMember, email: e.target.value})} 
                            required 
                            style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '1', minWidth: '150px'}}
                        />
                        {!editingMember && (
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={newMember.password} 
                                onChange={e => setNewMember({...newMember, password: e.target.value})} 
                                required 
                                style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd', flex: '1', minWidth: '150px'}}
                            />
                        )}
                        <button 
                            type="submit" 
                            style={{ 
                                padding: '12px 25px', 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                        >
                            {editingMember ? 'Update Member' : 'Add Member'}
                        </button>
                    </form>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Name</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {team.map(m => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                        <td style={{ padding: '15px' }}>{m.fullName}</td>
                                        <td style={{ padding: '15px' }}>{m.email}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button 
                                                onClick={() => handleEditMemberClick(m)} 
                                                style={{ 
                                                    marginRight: '10px', 
                                                    padding: '5px 10px', 
                                                    backgroundColor: '#ffc107', 
                                                    border: 'none', 
                                                    borderRadius: '4px', 
                                                    cursor: 'pointer' 
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteMember(m.id)} 
                                                style={{ 
                                                    padding: '5px 10px', 
                                                    backgroundColor: '#dc3545', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '4px', 
                                                    cursor: 'pointer' 
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoices Table */}
            {(role === 'Account Owner' || role === 'Admin') && (
                <div style={{ 
                    background: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                        <h2 style={{ margin: 0, color: '#333' }}>
                            {role === 'Admin' ? 'All User Invoices' : 'Billing History'}
                        </h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {role === 'Account Owner' && (
                                <>
                                    {invoices.length > 0 && (
                                        <button 
                                            onClick={handleClearHistory} 
                                            style={{ 
                                                padding: '10px 20px', 
                                                backgroundColor: '#6c757d', 
                                                color: 'white', 
                                                border: 'none', 
                                                borderRadius: '6px', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            Clear History
                                        </button>
                                    )}
                                    {invoices.some(inv => inv.subStatus === 'active' || inv.status === 'active') && (
                                        <button 
                                            onClick={handleCancelSubscription} 
                                            style={{ 
                                                padding: '10px 20px', 
                                                backgroundColor: '#dc3545', 
                                                color: 'white', 
                                                border: 'none', 
                                                borderRadius: '6px', 
                                                fontWeight: 'bold', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            Cancel Active Plan
                                        </button>
                                    )}
                                </>
                            )}
                            {role === 'Admin' && allUserInvoices.length > 0 && (
                                <button 
                                    onClick={handleClearAllInvoices} 
                                    style={{ 
                                        padding: '10px 20px', 
                                        backgroundColor: '#6c757d', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Clear All Invoices
                                </button>
                            )}
                        </div>
                    </div>

                    <input 
                        type="text" 
                        value={filtering} 
                        onChange={e => setFiltering(e.target.value)}
                        placeholder="🔍 Search records..."
                        style={{ 
                            marginBottom: '15px', 
                            padding: '12px', 
                            width: '100%', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd',
                            fontSize: '14px'
                        }}
                    />
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                {activeTable.getHeaderGroups().map(hg => (
                                    <tr key={hg.id} style={{ backgroundColor: '#f8f9fa' }}>
                                        {hg.headers.map(header => (
                                            <th 
                                                key={header.id} 
                                                onClick={header.column.getToggleSortingHandler()} 
                                                style={{ 
                                                    padding: '15px', 
                                                    textAlign: 'left', 
                                                    cursor: 'pointer', 
                                                    borderBottom: '2px solid #e0e0e0',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ' ↕️'}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {activeTable.getRowModel().rows.map(row => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} style={{ padding: '15px' }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <button 
                            onClick={() => activeTable.previousPage()} 
                            disabled={!activeTable.getCanPreviousPage()} 
                            style={{ 
                                padding: '8px 15px', 
                                cursor: activeTable.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                                backgroundColor: activeTable.getCanPreviousPage() ? '#007bff' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                transition: '0.3s'
                            }}
                        >
                            Previous
                        </button>
                        <span style={{ padding: '8px 15px', color: '#333' }}>
                            Page {activeTable.getState().pagination.pageIndex + 1} of {activeTable.getPageCount()}
                        </span>
                        <button 
                            onClick={() => activeTable.nextPage()} 
                            disabled={!activeTable.getCanNextPage()} 
                            style={{ 
                                padding: '8px 15px', 
                                cursor: activeTable.getCanNextPage() ? 'pointer' : 'not-allowed',
                                backgroundColor: activeTable.getCanNextPage() ? '#007bff' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                transition: '0.3s'
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;















