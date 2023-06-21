import { getClient } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    
    
    try {
        const db = getClient()
        const blogId = req.query.blogId as string;
        const {data, error} = await db.from('posts').select('*').eq('blog_id', blogId);
        if (error) {
            return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "ERROR TRYING TO RETURN POSTS" });
    }
    }