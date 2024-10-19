import { Store, Home, MapPin } from 'lucide-react';

interface LocationIconProps {
	isFLGS?: boolean;
	isPrivate?: boolean;
	className?: string;
}

export function LocationIcon({
	isFLGS,
	isPrivate,
	className,
}: LocationIconProps) {
	if (isFLGS) {
		return (
			<span title='Friendly Local Game Store'>
				<Store className={className || 'w-4 h-4 mr-2'} />
			</span>
		);
	} else if (isPrivate) {
		return (
			<span title='Private Location'>
				<Home className={className || 'w-4 h-4 mr-2'} />
			</span>
		);
	} else {
		return (
			<span title='Other Location'>
				<MapPin className={className || 'w-4 h-4 mr-2'} />
			</span>
		);
	}
}
