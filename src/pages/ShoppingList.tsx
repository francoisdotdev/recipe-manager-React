import { ShoppingList } from "../components/shopping/shoppingList";
import { useShoppingList } from "../hooks/useShoppingList";
import "../App.css"

export default function ShoppingListPage() {
  const items = useShoppingList();

  const generateText = () =>
    items.length === 0
      ? "Aucune course a faire"
      : items.map(ing => `${ing.name} — ${ing.quantity} ${ing.unit}`).join("\n");

  const handleCopy = () => {
    const text = generateText();
    navigator.clipboard.writeText(text).then(() => {
      alert("Copié dans le clipboard");
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const doc = printWindow.document;

    const h1 = doc.createElement("h1");
    h1.textContent = "Liste de courses";
    doc.body.appendChild(h1);

    const ul = doc.createElement("ul");
    items.forEach(ing => {
      const li = doc.createElement("li");
      li.textContent = `${ing.name} — ${ing.quantity} ${ing.unit}`;
      ul.appendChild(li);
    });

    doc.body.appendChild(ul);

    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Liste de courses</h1>

      <div style={{ marginBottom: 16 }}>
        <button onClick={handleCopy} style={{ marginRight: 8 }}>Copier</button>
        <button onClick={handlePrint}>Imprimer</button>
      </div>

      <ShoppingList items={items} />
    </div>
  );
}
