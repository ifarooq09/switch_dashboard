import { Link } from "react-router-dom";
import { Typography, Card, CardMedia, CardContent, Stack } from "@mui/material";


import { BuildingCardProps } from "interfaces/property"

const BuildingCard = ({ id, buildingName, photo }: BuildingCardProps) => {
    return (
        <Card component={Link} to={`/building/show/${id}`} sx={{
          maxWidth: '330px',
          padding: '10px',
          '&:hover': {
            boxShadow: '0 22px 25px 2px rgba(176, 176, 176, 0.1)'
          },
          cursor: 'pointer',
        }}
        elevation={0}
        >
        <CardMedia 
          component="img"
          width="100%"
          height={210}
          image={photo}
          alt="card image"
          sx={{ borderRadius: '10px'}}
        />
          <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', gap: '10px', paddingX: '5px' }}>
            <Stack direction="column" gap={1}>
              <Typography fontSize={16} fontWeight={500} color="#11142d">{buildingName}</Typography>
            </Stack>
          </CardContent>
    
        </Card>
      )
}

export default BuildingCard
