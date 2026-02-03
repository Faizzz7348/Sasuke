import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed data for Selangor tables
const selangorTables = [
  {
    name: "Customer Database",
    description: "Complete customer information and contact details",
    region: "selangor",
    rows: 1250,
    columns: 15,
    status: "active",
    createdBy: "Admin User",
  },
  {
    name: "Product Inventory",
    description: "Current stock levels and product specifications",
    region: "selangor",
    rows: 450,
    columns: 12,
    status: "active",
    createdBy: "John Doe",
  },
  {
    name: "Sales Records 2024",
    description: "Annual sales data and performance metrics",
    region: "selangor",
    rows: 3200,
    columns: 20,
    status: "active",
    createdBy: "Jane Smith",
  },
  {
    name: "Employee Directory",
    description: "Staff information and department assignments",
    region: "selangor",
    rows: 85,
    columns: 10,
    status: "active",
    createdBy: "HR Manager",
  },
  {
    name: "Project Timeline",
    description: "Task assignments and milestone tracking",
    region: "selangor",
    rows: 234,
    columns: 18,
    status: "draft",
    createdBy: "Project Lead",
  },
  {
    name: "Marketing Campaigns",
    description: "Campaign performance and ROI analysis",
    region: "selangor",
    rows: 67,
    columns: 14,
    status: "archived",
    createdBy: "Marketing Team",
  },
]

// Seed data for KL tables
const klTables = [
  {
    name: "Customer Database",
    description: "Route KL 7 - Customer information and contact details",
    region: "kl",
    rows: 1150,
    columns: 15,
    status: "active",
    createdBy: "Admin User",
  },
  {
    name: "KL Delivery Routes",
    description: "Main city delivery routes and schedules",
    region: "kl",
    rows: 850,
    columns: 18,
    status: "active",
    createdBy: "Operations Manager",
  },
  {
    name: "City Center Orders",
    description: "Orders from KLCC and surrounding areas",
    region: "kl",
    rows: 2100,
    columns: 22,
    status: "active",
    createdBy: "Sales Team",
  },
  {
    name: "Restaurant Partners",
    description: "List of partner restaurants in KL",
    region: "kl",
    rows: 320,
    columns: 14,
    status: "active",
    createdBy: "Partnership Team",
  },
  {
    name: "Rider Database KL",
    description: "Active riders and their performance metrics",
    region: "kl",
    rows: 156,
    columns: 16,
    status: "active",
    createdBy: "HR Department",
  },
  {
    name: "Traffic Analysis",
    description: "Peak hours and traffic pattern data",
    region: "kl",
    rows: 450,
    columns: 11,
    status: "draft",
    createdBy: "Data Analyst",
  },
  {
    name: "Customer Feedback KL",
    description: "Customer reviews and ratings",
    region: "kl",
    rows: 1890,
    columns: 9,
    status: "active",
    createdBy: "Customer Service",
  },
]

async function seed() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.tableData.deleteMany()
  await prisma.table.deleteMany()

  // Create Selangor tables with tableData
  console.log('Creating Selangor tables...')
  for (const tableData of selangorTables) {
    const table = await prisma.table.create({
      data: tableData,
    })
    
    // Add sample tableData for each Selangor table
    console.log(`Adding sample data for ${table.name}...`)
    const sampleRows = [
      {
        tableId: table.id,
        code: `SEL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Petaling Jaya, Selangor',
        delivery: 'Express',
        lat: (3.0738 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.5183 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60123456789',
          status: 'active',
          name: `${table.name} Entry 1`
        }
      },
      {
        tableId: table.id,
        code: `SEL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Shah Alam, Selangor',
        delivery: 'Standard',
        lat: (3.0733 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.5185 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60129876543',
          status: 'active',
          name: `${table.name} Entry 2`
        }
      },
      {
        tableId: table.id,
        code: `SEL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Subang Jaya, Selangor',
        delivery: 'Same Day',
        lat: (3.0735 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.5180 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60125555555',
          status: 'inactive',
          name: `${table.name} Entry 3`
        }
      },
    ]
    
    for (const row of sampleRows) {
      await prisma.tableData.create({ data: row })
    }
  }

  // Create KL tables with tableData
  console.log('Creating KL tables...')
  for (const tableData of klTables) {
    const table = await prisma.table.create({
      data: tableData,
    })
    
    // Add sample tableData for each KL table
    console.log(`Adding sample data for ${table.name}...`)
    const sampleRows = [
      {
        tableId: table.id,
        code: `KL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'KLCC, Kuala Lumpur',
        delivery: 'Express',
        lat: (3.1390 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.6869 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60321234567',
          status: 'active',
          name: `${table.name} Entry 1`
        }
      },
      {
        tableId: table.id,
        code: `KL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Bukit Bintang, Kuala Lumpur',
        delivery: 'Standard',
        lat: (3.1478 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.7123 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60327778888',
          status: 'active',
          name: `${table.name} Entry 2`
        }
      },
      {
        tableId: table.id,
        code: `KL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Cheras, Kuala Lumpur',
        delivery: 'Same Day',
        lat: (3.1218 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.7412 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60329999999',
          status: 'inactive',
          name: `${table.name} Entry 3`
        }
      },
      {
        tableId: table.id,
        code: `KL-${Math.floor(1000 + Math.random() * 9000)}`,
        location: 'Bangsar, Kuala Lumpur',
        delivery: 'Next Day',
        lat: (3.1285 + (Math.random() - 0.5) * 0.1).toFixed(6),
        lng: (101.6740 + (Math.random() - 0.5) * 0.1).toFixed(6),
        data: {
          contact: '+60321112222',
          status: 'active',
          name: `${table.name} Entry 4`
        }
      },
    ]
    
    for (const row of sampleRows) {
      await prisma.tableData.create({ data: row })
    }
  }

  console.log('✅ Seeding completed!')
  console.log(`📊 Created ${selangorTables.length} Selangor tables with ${selangorTables.length * 3} rows`)
  console.log(`📊 Created ${klTables.length} KL tables with ${klTables.length * 4} rows`)
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
