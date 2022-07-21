import { Box, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

export default function DemoWarning() {
    return (
        <Box
            width="100%"
            height={50}
            sx={{
                bgcolor: "#dc3545",
            }}
            alignItems="center"
            justifyContent="center"
            display="flex"
        >
            <WarningIcon sx={{ fontSize: 30 }} />
            <Typography variant="h6">
                This is a demo site. DON'T put any personal
                information
            </Typography>
        </Box>
    );
}
