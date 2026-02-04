import {
	createRouter,
	createRootRoute,
	createRoute,
	Outlet,
	Link,
	createHashHistory,
} from "@tanstack/react-router";
import { ChefHat } from "lucide-react";
import {
	HomePage,
	RecipePage,
	MyRecipesPage,
	PlanningPage,
	ShoppingPage,
} from "./pages";

const rootRoute = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<div className="app">
			<nav className="navbar">
				<div className="navbar-inner">
					<Link to="/" className="navbar-brand">
						<ChefHat className="icon-sm" /> Recettes
					</Link>
					{[
						{ to: "/" as const, label: "Catalogue" },
						{ to: "/mes-recettes" as const, label: "Mes recettes" },
						{ to: "/planning" as const, label: "Planning" },
						{ to: "/shopping" as const, label: "Courses" },
					].map(({ to, label }) => (
						<Link key={to} to={to} className="navbar-link">
							{label}
						</Link>
					))}
				</div>
			</nav>
			<main className="main-content">
				<Outlet />
			</main>
		</div>
	);
}

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: HomePage,
});

const recipeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/recipe/$recipeId",
	component: function RecipePageWrapper() {
		const { recipeId } = recipeRoute.useParams();
		return <RecipePage recipeId={Number(recipeId)} />;
	},
});

const myRecipesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/mes-recettes",
	component: MyRecipesPage,
});

const planningRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/planning",
	component: PlanningPage,
});

const shoppingRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/shopping",
	component: ShoppingPage,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	recipeRoute,
	myRecipesRoute,
	planningRoute,
	shoppingRoute,
]);

export const router = createRouter({
	routeTree,
	history: createHashHistory(),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
