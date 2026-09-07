export default function AuthLayout({ children }) {
	return (
		<div className="grid grid-cols-2">
			<div></div>
			<div>{children}</div>
		</div>
	);
}
