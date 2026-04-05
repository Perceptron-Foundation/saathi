export default function GeneralAIPage() {
  return (
    <div className="h-screen w-full">
      <iframe
        title="Saathi General AI Chat"
        src="https://saathi-ai-tn773dcmimwvrh6qvnuus3.streamlit.app/General_Chat?embed=true"
        className="h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}