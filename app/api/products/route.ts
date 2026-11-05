// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/db';
import ProductModel from '@/models/Product';


export interface Product {
  id: string;
  name: string;
  price: number; // number, not '$29.99' - the UI formats it
  image: string | null;
}


interface ApiSuccess<T> {
  success: true;
  data: T;
}


interface ApiFailure {
  success: false;
  error: string;
}


export async function GET() {
  try {
    await dbConnect();
    
    // Fetching all products from the database
    const products = await ProductModel.find({}).sort({ createdAt: -1 });


    // Matching the data format with the frontend interface
    const formattedProducts: Product[] = products.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name || doc.title || '',
      price: typeof doc.price === 'number' ? doc.price : parseFloat(doc.price) || 0,
      image: doc.image || doc.imageUrl || null,
    }));


    const response: ApiSuccess<Product[]> = {
      success: true,
      data: formattedProducts,
    };


    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    const failureResponse: ApiFailure = {
      success: false,
      error: error.message || 'Failed to fetch products',
    };


    return NextResponse.json(failureResponse, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();


    const { name, price, image } = body;


    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }


    const newProduct = await ProductModel.create({
      name,
      price: Number(price),
      image: image || null,
    });


    const formattedProduct: Product = {
      id: newProduct._id.toString(),
      name: newProduct.name,
      price: newProduct.price,
      image: newProduct.image,
    };


    return NextResponse.json({ success: true, data: formattedProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}