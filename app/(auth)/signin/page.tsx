'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
	const supabase = createSupabaseClient()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// If already logged in, go home
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) router.replace('/')
		})
	}, [])

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		setLoading(false)

		if (error) {
			setError(error.message)
			return
		}

		router.replace('/')
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-xl border border-gray-200 p-6 shadow-sm">
				<h1 className="text-2xl font-semibold mb-4">Sign in</h1>
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
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="••••••••"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-50"
					>
						{loading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>

				{error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

				<p className="mt-6 text-sm text-gray-600">
					Don't have an account?{' '}
					<Link href="/signup" className="text-indigo-600 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	)
}


