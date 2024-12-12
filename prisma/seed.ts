import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed Categories
    await prisma.category.createMany({
      data: [
        { name: 'Cleaning', iconUrl: '/images/cleaning.png' },
        { name: 'Handyman', iconUrl: '/images/handyman.png' },
        { name: 'Event Planning', iconUrl: '/images/eventplanning.png' },
        { name: 'Personal', iconUrl: '/images/personal.png' },
      ],
      skipDuplicates: true, // Avoid creating duplicates if the data already exists
    });
    console.log('Categories seeded successfully.');

    // Seed Businesses
    await prisma.business.createMany({
      data: [
        {
          name: 'House Cleaning',
          contactPerson: 'Jenny Wong',
          address: '255, Jalan Putri 8/8, Puchong, Selangor',
          about:
            'We offer thorough cleaning services for your house. We work as a great team as we are very organized, methodical and thorough in our job.',
          image: ['/images/business2.png', '/images/business2.png'],
          categoryId: 1,
          email: 'jenny@gmail.com',
          price: 70,
          bookings: 23,
          rating: 5,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        {
          name: 'Kitchen Cleaning',
          contactPerson: 'Jenny Wong',
          address: '255, Jalan Putri 8/8, Puchong, Selangor',
          about:
            'We offer thorough cleaning services for your kitchen. Our professional cleaners are equipped with the right and the latest skillset.',
          image: ['/images/business1.png'], // Adjusted for multiple images
          categoryId: 1,
          email: 'jenny@gmail.com',
          price: 30,
          bookings: 17,
          rating: 3,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        {
          name: 'Handyman Services',
          contactPerson: 'Ahmad',
          address: '45, Jalan Jalil, Bukit Jalil, Kuala Lumpur',
          about: 'Expert handyman services for all your home needs.',
          image: ['/images/business3.png'],
          categoryId: 2,
          email: 'ronaldo@handyman.com',
          price: 60,
          bookings: 45,
          rating: 5,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        {
          name: 'Event Planning',
          contactPerson: 'Emma Tan',
          address: '700, Jalan Jalil, Bukit Jalil, Kuala Lumpur',
          about:
            'Professional event planning services for occasions including birthday party, wedding party and more.',
          image: ['/images/business4.png'],
          categoryId: 3,
          email: 'emma@events.com',
          price: 300,
          bookings: 30,
          rating: 5,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        {
          name: 'Bathroom Cleaning',
          contactPerson: 'Jayden Koo',
          address: '700, Jalan Jalil, Bukit Jalil, Kuala Lumpur',
          about: 'We offer thorough cleaning services for your bathroom.',
          image: ['/images/business2.png'],
          categoryId: 1,
          email: 'jayden@cleaning.com',
          price: 60,
          bookings: 10,
          rating: 3,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        {
          name: 'Manicure Service',
          contactPerson: 'Jane Poh',
          address: '75, Jalan Jalil, Bukit Jalil, Kuala Lumpur',
          about: 'Manicure services with 5 years experience.',
          image: ['/images/business6.png'],
          categoryId: 4,
          email: 'jane@personalservice.com',
          price: 150,
          bookings: 15,
          rating: 4,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        {
          name: 'Makeup Service',
          contactPerson: 'Joey Leong',
          address: '75, Jalan Jalil, Bukit Jalil, Kuala Lumpur',
          about: 'Makeup services with 5 years experience.',
          image: ['/images/business5.png'],
          categoryId: 4,
          email: 'joey@personalservice.com',
          price: 100,
          bookings: 16,
          rating: 2,
          adminStatus: 'approved',
          businessStatus: 'active',
        },
      ],
    });
    console.log('Businesses seeded successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
