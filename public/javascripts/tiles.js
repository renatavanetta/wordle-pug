const tile = document.querySelector('#board-area')


for(let a=0; a<=5; a++){
    const tile_line = document.createElement('div');
    tile_line.setAttribute('id', 'line-' + a);
    tile_line.classList.add('line')
    for(let b=0; b<5; b++){
        const tile_column = document.createElement('div');
        tile_column.setAttribute('id', 'line-' + a + '-column-' + b)
        tile_column.classList.add('tile');
        tile_line.append(tile_column);
    }
    tile.append(tile_line);
}

