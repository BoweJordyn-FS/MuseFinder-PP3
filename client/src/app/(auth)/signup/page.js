'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeSlash } from 'iconsax-react';

function Signup() {
	const { signup } = useAuth();
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);

	const handleSignup = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		try {
			await signup(username, email, password);
			router.push('/');
		} catch (err) {
			setError(err.response?.data?.error || 'Signup failed');
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex flex-col justify-center h-full p-10">
			<h1 className="text-3xl font-bold text-black ml-20">Sign Up</h1>
			<div className="self-center">
				<form
					className="text-black w-md"
					onSubmit={handleSignup}
				>
					<div className="relative mt-6">
						<input
							id="username"
							type="text"
							className="float-input"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<label
							htmlFor="username"
							className="float-label"
						>
							Username
						</label>
					</div>
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
								/>
							) : (
								<Eye
									size={22}
									color="currentColor"
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
						{isSubmitting ? 'Creating account…' : 'Signup'}
					</button>
				</form>
				<div className="text-black mt-5 text-center">
					<Link
						href="/login"
						className="hover:text-[#925FF0]"
					>
						Already have an account? Login!
					</Link>
				</div>
			</div>
		</main>
	);
}

export default Signup;
