import React, { FC } from 'react'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import './publisher.scss'

export const Publisher: FC = () => {
  return (
    <Container maxWidth="md">
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </Container>
  )
}
