export default function AuthLayout({ children }) {
	return (
		<html lang="en">
			<body className="grid grid-cols-2">
				<div></div>
				<div>{children}</div>
			</body>
		</html>
	);
}
