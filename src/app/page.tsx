import collectionData from "@/config/collection.json";
import { CollectionDatabase } from "@/types/schema";
import { ThemeProvider } from "@/context/ThemeContext";
import { CollectionViewer } from "@/components/CollectionViewer";

export default function HomePage() {
  const data = collectionData as CollectionDatabase;

  return (
    <ThemeProvider
      initialAestheticType={data.collectionMetadata.aestheticType}
      initialTokens={data.themingTokens}
    >
      <main>
        <CollectionViewer initialData={data} />
      </main>
    </ThemeProvider>
  );
}
