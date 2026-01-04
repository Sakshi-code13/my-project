import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Leaderboard() {
  const { data, error, isLoading } = useSWR("/api/leaderboard", fetcher, {
    refreshInterval: 10000, // refresh every 10s for live updates
  });

  if (isLoading) return <p className="text-gray-400 italic">Loading leaderboard...</p>;
  if (error) return <p className="text-red-400">Error loading leaderboard.</p>;

  const leaderboard = data?.leaderboard || [];

  return (
    <div className="space-y-2">
      {leaderboard.map((player, index) => (
        <div
          key={player.name}
          className="flex items-center justify-between bg-black/60 px-4 py-2 rounded border border-green-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-bold">{index + 1}.</span>
            {player.image && (
              <img
                src={player.image}
                alt={player.name}
                className="w-8 h-8 rounded-full border border-green-500"
              />
            )}
            <span className="text-white font-semibold">{player.name}</span>
          </div>
          <span className="text-green-300 font-bold">{player.xp} XP</span>
          <span className={`font-bold ${
  index === 0 ? "text-yellow-400" :
  index === 1 ? "text-gray-300" :
  index === 2 ? "text-orange-400" :
  "text-green-300"
}`}>
  {player.xp} XP
</span>

        </div>
      ))}
    </div>
  );
}
