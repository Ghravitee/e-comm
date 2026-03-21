// components/DebugStorage.tsx
import { useState } from "react";
import { supabase } from "../../services/supabase/client";

export const DebugStorage = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    try {
      // Test 1: Auth
      addResult("Testing authentication...");
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      addResult(
        `✅ Authenticated as: ${sessionData.session?.user?.email || "Not logged in"}`,
      );

      // Test 2: List buckets
      addResult("Listing buckets...");
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();
      if (bucketsError) throw bucketsError;

      addResult(`✅ Found ${buckets.length} buckets:`);
      buckets.forEach((b) =>
        addResult(`   - ${b.name} (${b.public ? "public" : "private"})`),
      );

      // Test 3: Check products bucket
      const productsBucket = buckets.find((b) => b.name === "products");
      if (!productsBucket) {
        addResult("❌ Products bucket not found!");
      } else {
        addResult(
          `✅ Products bucket exists: ${productsBucket.public ? "public" : "private"}`,
        );

        // Test 4: List files in products bucket
        addResult("Listing files in products bucket...");
        const { data: files, error: filesError } = await supabase.storage
          .from("products")
          .list();

        if (filesError) throw filesError;
        addResult(`✅ Found ${files.length} files/folders`);
        files.forEach((f) => addResult(`   - ${f.name} (${f.id})`));
      }

      // Test 5: Try to upload a tiny test file
      addResult("Testing upload with tiny test file...");
      const testContent = "test";
      const testFile = new File([testContent], "test.txt", {
        type: "text/plain",
      });
      const testPath = `test-${Date.now()}.txt`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(testPath, testFile);

      if (uploadError) {
        addResult(`❌ Upload test failed: ${uploadError.message}`);
      } else {
        addResult(`✅ Upload test successful!`);

        // Clean up test file
        await supabase.storage.from("products").remove([testPath]);
        addResult(`✅ Test file cleaned up`);
      }
    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`);
      console.error("Debug error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border max-w-md z-50">
      <h3 className="font-bold mb-2">Storage Debugger</h3>
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 mb-2"
      >
        {loading ? "Running..." : "Run Tests"}
      </button>

      <div className="bg-gray-50 p-2 rounded max-h-60 overflow-y-auto text-xs font-mono">
        {results.length === 0 ? (
          <p className="text-gray-400">Click "Run Tests" to start</p>
        ) : (
          results.map((result, i) => (
            <div key={i} className="mb-1 border-b border-gray-200 pb-1">
              {result}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
