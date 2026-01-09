import { Box, Container } from '@mui/material';


export default function FacturasServiciosPage( { children }: { children: React.ReactNode } ) {

  return (
    <Box
     sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',

        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 12, sm: 14 },
          pb: { xs: 4, sm: 6 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
