interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-granite-900">{title}</h1>
      <p className="text-granite-600 mt-2">Esta página será implementada em breve</p>
    </div>
  );
}

