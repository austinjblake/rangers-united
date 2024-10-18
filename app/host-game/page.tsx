'use client';

import { useState, useEffect } from 'react';
import GameForm from '@/components/game-form';
import MaxSlotsReachedCard from '@/components/max-slots-reached-card';
import { checkUserSlotsRemaining } from '@/actions/slots-actions';

export default function HostGamePage() {
	const [hasSlotsRemaining, setHasSlotsRemaining] = useState(true);

	useEffect(() => {
		checkSlotsRemaining();
	}, []);

	const checkSlotsRemaining = async () => {
		const result = await checkUserSlotsRemaining();
		setHasSlotsRemaining(result.data);
	};

	if (!hasSlotsRemaining) {
		return <MaxSlotsReachedCard />;
	}

	return <GameForm />;
}
