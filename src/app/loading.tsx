import CardBlockSkeleton from '@/components/blocks/CardBlockSkeleton';

export default function Loading() {
	return (
		<main>
			<div className="grid grid-cols-3 gap-8">
				{'abcdefghi'.split('').map((i) => (
					<CardBlockSkeleton key={i} />
				))}
			</div>
		</main>
	);
}
