
import FacturaCard from "../../components/facturacionCards/FacturaCard";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function FacturaPage() {


    

    return(
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
          pt: 4,
          pb: 4
        }}
      >
        <FacturaCard></FacturaCard>
      </Container>
    </Box>
    )


}