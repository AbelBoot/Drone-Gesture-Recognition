import io from 'socket.io-client';

export function main(b, p, c){
	for (let i = 0; i < b.length / 4; i+4){
		b[4* i + 0] = Math.abs(p[4* i + 0] - c[4* i + 0])
		b[4* i + 1] = Math.abs(p[4* i + 1] - c[4* i + 1])
		b[4* i + 2] = Math.abs(p[4* i + 2] - c[4* i + 2])
		b[4* i + 3] = 255
		i++
	}
	return b
}

export const socket = io("http://localhost:6767")


