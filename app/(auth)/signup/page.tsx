'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function SignUpPage() {
	const supabase = createSupabaseClient()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setMessage(null)
		setLoading(true)

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo:
					typeof window !== 'undefined'
						? `${window.location.origin}/auth/callback`
						: undefined
			}
		})

		setLoading(false)

		if (error) {
			setError(error.message)
			return
		}

		if (data.user && !data.session) {
			setMessage('Check your email to confirm your account.')
		} else {
			setMessage('Account created!')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-xl border border-gray-200 p-6 shadow-sm">
				<h1 className="text-2xl font-semibold mb-4">Create your account</h1>
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm mb-1">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="you@example.com"
							autoComplete="email"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
							className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="••••••••"
							autoComplete="new-password"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
					>
						{loading ? 'Creating...' : 'Sign Up'}
					</button>
				</form>

				{error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
				{message && <p className="text-green-600 mt-3 text-sm">{message}</p>}

				<p className="mt-6 text-sm text-gray-600">
					Already have an account?{' '}
					<Link href="/signin" className="text-indigo-600 hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}


