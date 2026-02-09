import * as jwt from 'jsonwebtoken';
import { Users } from 'src/entities/users.entity';


export function generateToken(user: Users): string{
    const payload = {id: user.id, username: user.userName, email: user.email, role: user.roles};
    const key = process.env.JWT_SECRET;
    return jwt.sign(payload, key as string, {expiresIn: '7d'});
}