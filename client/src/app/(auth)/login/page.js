'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeSlash } from 'iconsax-react';

function Login() {
	const { login } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		try {
			await login(email, password);
			router.push('/');
		} catch (err) {
			setError(err.response?.data?.error || err.message || 'Login failed');
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex flex-col justify-center h-full p-10">
			<h1 className="text-3xl font-bold text-black ml-20">Login</h1>
			<div className="self-center">
				<form
					className="text-black w-md"
					onSubmit={handleLogin}
				>
					<div className="relative mt-6">
						<input
							id="email"
							type="email"
							className="float-input"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<label
							htmlFor="email"
							className="float-label"
						>
							Email
						</label>
					</div>
					<div className="relative mt-6">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							className="float-input pr-12"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<label
							htmlFor="password"
							className="float-label"
						>
							Password
						</label>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#925FF0]"
						>
							{showPassword ? (
								<EyeSlash
									size={22}
									color="currentColor"
									variant="Broken"
								/>
							) : (
								<Eye
									size={22}
									color="currentColor"
									variant="Broken"
								/>
							)}
						</button>
					</div>
					{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-black rounded-full p-2 text-white w-full mt-6 hover:bg-[#925FF0] disabled:opacity-50"
					>
						{isSubmitting ? 'Logging in…' : 'Login'}
					</button>
				</form>
				<div className="text-black mt-5 text-center">
					<Link
						href="/signup"
						className="hover:text-[#925FF0]"
					>
						Don&apos;t have an account? Create one!
					</Link>
				</div>
			</div>
		</main>
	);
}

export default Login;
