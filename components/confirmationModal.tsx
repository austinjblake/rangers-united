'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon } from 'lucide-react';

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
}

export function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}: ConfirmationModalProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			const timer = setTimeout(() => setIsVisible(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!isVisible) return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
				isOpen ? 'opacity-100' : 'opacity-0'
			} transition-opacity duration-300`}
		>
			<div className='fixed inset-0 bg-black bg-opacity-50' onClick={onClose} />
			<div className='relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out'>
				<div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100'>
					<AlertTriangleIcon className='w-6 h-6 text-yellow-600' />
				</div>
				<h3 className='mb-4 text-lg font-medium text-gray-900 text-center'>
					{title}
				</h3>
				<p className='mb-6 text-sm text-gray-500 text-center'>{message}</p>
				<div className='flex justify-center space-x-4'>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button variant='destructive' onClick={onConfirm}>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
}
