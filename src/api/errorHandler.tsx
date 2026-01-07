import { useEffect, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const ERROR_EVENT = 'app-connection-error';

type ErrorPayload = {
	message: string;
	description?: string;
};
// Dispara un evento global para mostrar el snackbar
export function emitError(payload: ErrorPayload) {
	window.dispatchEvent(new CustomEvent<ErrorPayload>(ERROR_EVENT, { detail: payload }));
}

class ErrorHandler {
	private connectionErrorShown = false;

	handleConnectionError(response: Response, errorMessage: string): void {
		console.log(response, errorMessage);
		if (
			(response.status === 500 || response.status === 401) &&
			(errorMessage.includes('API Error: 500') || errorMessage.includes('Network Error') || errorMessage.includes('Su sesión es inválida')) &&
			!this.connectionErrorShown
		) {
			this.connectionErrorShown = true;
			emitError({
				message: 'Error de Conexión',
				description: 'No se pudo conectar con el servidor. Por favor, intente nuevamente más tarde.',
			});

			// Permite volver a mostrar el error si sigue ocurriendo después de 30s
			setTimeout(() => {
				this.connectionErrorShown = false;
			}, 30000);
		}
	}
}

export const errorHandler = new ErrorHandler();

// Componente global que escucha los eventos y muestra el Snackbar + Alert de MUI
export function ErrorNotifier() {
	const [open, setOpen] = useState(false);
	const [payload, setPayload] = useState<ErrorPayload | null>(null);

	const handleClose = (_?: unknown, reason?: string) => {
		if (reason === 'clickaway') return;
		setOpen(false);
	};

	const listener = useMemo(
		() =>
			(event: Event) => {
				const customEvent = event as CustomEvent<ErrorPayload>;
				setPayload(customEvent.detail);
				setOpen(true);
			},
		[]
	);

	useEffect(() => {
		window.addEventListener(ERROR_EVENT, listener);
		return () => window.removeEventListener(ERROR_EVENT, listener);
	}, [listener]);

	return (
		<Snackbar
			open={open}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			autoHideDuration={30000}
			onClose={handleClose}
		>
			<Alert action={
            <IconButton
              aria-label="cerrar"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
              sx={{ backgroundColor: 'transparent !important', borderColor: 'transparent !important', padding: 0 }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          } severity="error" variant="filled" sx={{ alignItems: 'flex-start' }}>
				{payload?.message && <AlertTitle>{payload.message}</AlertTitle>}
				{payload?.description}
			</Alert>
		</Snackbar>
	);
}
