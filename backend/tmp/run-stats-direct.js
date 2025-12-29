import('../src/config/database.js').then(async ()=>{
  const { Ticket, Equipment, User } = await import('../src/models/index.js');
  try{
    const totalTickets = await Ticket.count();
    const openTickets = await Ticket.count({ where: { status: 'nuevo' } });
    const recentTickets = await Ticket.findAll({ limit:3, order:[['created_at','DESC']], include:[{ model: User, as: 'reportedBy', attributes: ['nombre_completo'] }] });
    console.log({ totalTickets, openTickets, recentTicketsCount: recentTickets.length });
    console.log('Sample recent ticket:', recentTickets[0] ? recentTickets[0].toJSON() : null);
  }catch(e){ console.error('ERROR RUN STATS DIRECT', e); }
  process.exit(0);
}).catch(e=>{console.error('DB LOAD ERROR', e); process.exit(1);});
