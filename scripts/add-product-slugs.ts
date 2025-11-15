import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

async function addSlugsToProducts() {
  try {
    // Get all products
    const allProducts = await prisma.product.findMany();

    for (const product of allProducts) {
      // Check if slug exists (this is a workaround since we're adding the field)
      let slug = generateSlug(product.name);
      
      // Check if slug already exists
      let existingProduct = await prisma.product.findUnique({
        where: { slug },
      });

      // If slug exists, add a number suffix
      let counter = 1;
      let finalSlug = slug;
      while (existingProduct && existingProduct.id !== product.id) {
        finalSlug = `${slug}-${counter}`;
        existingProduct = await prisma.product.findUnique({
          where: { slug: finalSlug },
        });
        counter++;
      }

      // Update product with slug
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: finalSlug },
      });

      console.log(`Updated product "${product.name}" with slug: ${finalSlug}`);
    }

    console.log("All products have been updated with slugs!");
  } catch (error) {
    console.error("Error adding slugs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addSlugsToProducts();

