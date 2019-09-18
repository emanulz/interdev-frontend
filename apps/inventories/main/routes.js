import React from 'react'
import {Route} from 'react-router-dom'

// Routes Components

import Home from '../home/home.jsx'
import Movements from '../movements/main.jsx'
import Warehouses from '../warehouses/main.jsx'
import Tracking from '../tracking/main.jsx'
import PhysicalTake from '../physicalTake/main.jsx'
import TakeMovements from '../takeMovements/main.jsx'
import CheckTakeMovements from '../checkTakeMovements/main.jsx'
import MakeMassFileTransfer  from '../fileTransfer/main.jsx'
import FileTransferLoader from '../fileTransferLoad/main.jsx'
import ListFileTransfers from '../fileTransfer/list/main.jsx'
import ListMassInv from '../fileTransfer/list-mass/main.jsx'
import Transmutation from '../transmutation/main.jsx'

const routes = <div className='heigh100'>

  <Route exact path='/inventories' component={Home} />
  <Route path='/inventories/movements' component={Movements} />
  <Route path='/inventories/warehouses' component={Warehouses} />
  <Route path='/inventories/tracking' component={Tracking} />
  <Route path='/inventories/physical' component={PhysicalTake} />
  <Route path='/inventories/takemovements' component={TakeMovements} />
  <Route path='/inventories/checktakemovements' component={CheckTakeMovements} />

  <Route path='/inventories/makeFileTransfer' component={MakeMassFileTransfer} />
  <Route path='/inventories/loadFileTransfer' component={FileTransferLoader} />
  <Route path='/inventories/filetransferslist' component={ListFileTransfers} />

  <Route path='/inventories/masstransfer/:mode' component={MakeMassFileTransfer} />
  {/* <Route path='/inventories/makeFileTransfer/:mode' component={MakeMassFileTransfer} />
  <Route path='/inventories/makeFileTransfer/:mode' component={MakeMassFileTransfer} /> */}

  <Route path='/inventories/massloadlist/:mode' component={ListMassInv}/>
  {/* <Route path='/inventories/invloadlist/:mode' component={ListMassInv} />
  <Route path='/inventories/invloadlist/:mdoe' component={ListMassInv} /> */}
  <Route path='/inventories/recipes' component={Transmutation}/>
  
</div>

export default routes
