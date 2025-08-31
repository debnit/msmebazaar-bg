import { Request, Response, NextFunction } from 'express';

export function validateRequest(schema: { safeParse: (arg0: any) => any; }) {
  return (req: any, res:any,next:any)=>{
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten() });
    }
    req.validated = parsed.data;
    next();
  };
}
