const simulation = (t, state) => {
    // TODO Scale this using some dt
    state.player.position.x += state.moving * 10;
};

export default simulation;
